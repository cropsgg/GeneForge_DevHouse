import { Send } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Together } from 'together-ai';

import { useTheme } from '../context/ThemeContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // Add this line
}

export const ChatBot = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const together = new Together({
    apiKey: 'e395099d91d5e21ef0d42167910e1060c8e286824a24ca561e311efb5246ef00', // Replace with your actual API key
  });

  const handleSend = async () => {
    if (!hasInitialMessage && input.toLowerCase() !== 'hey') {
      setInput('');
      return;
    }

    // Always create user message even if empty
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    if (input.trim()) {
      setMessages(prev => [...prev, userMessage]);
      setHasInitialMessage(true);
    }
    setInput('');
    setIsLoading(true);

    try {
      const response = await together.chat.completions.create({
        messages: [
          {
            role: 'user',
            content:
              "You are an expert AI assistant for our CRISPR gene editing platform. Answer only questions related to CRISPR, gene editing, AI-driven predictions, and our platform's features. Keep responses clear, precise, and professional. If a question is unrelated, reply with: 'I specialize in CRISPR and AI-powered gene editing. Please ask relevant questions.",
          },
          ...messages,
        ],
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['<|eot_id|>', '<|eom_id|>'],
        stream: true,
      });

      let aiResponseContent = '';
      for await (const token of response) {
        aiResponseContent += token.choices[0]?.delta?.content || '';
        // Update message in real-time for streaming effect
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                content: aiResponseContent,
              },
            ];
          }
          return [
            ...prev,
            {
              role: 'assistant',
              content: aiResponseContent,
              timestamp: new Date().toISOString(),
            },
          ];
        });
      }

      if (!aiResponseContent.trim()) {
        console.warn('Received empty response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {!hasInitialMessage && (
        <View style={styles.initialMessageContainer}>
          <Text style={[styles.initialMessageText, isDark && { color: '#F9FAFB' }]}>
            Please type "hey" to start the conversation
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.role === 'user'
                ? [styles.userMessage, isDark && styles.userMessageDark]
                : [styles.assistantMessage, isDark && styles.assistantMessageDark],
            ]}
          >
            <Text>{msg.role === 'user' ? `You: ${msg.content}` : msg.content}</Text>
          </View>
        ))}
        {isLoading && (
          <View
            style={[styles.message, styles.assistantMessage, isDark && styles.assistantMessageDark]}
          >
            <Text>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about gene editing..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
          <Send size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E5E7EB',
  },
  userMessageDark: {
    backgroundColor: '#374151',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
  },
  assistantMessageDark: {
    backgroundColor: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputContainerDark: {
    borderTopColor: '#374151',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  inputDark: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDark: {
    backgroundColor: '#818CF8',
  },
  initialMessageContainer: {
    padding: 16,
    alignItems: 'center',
  },
  initialMessageText: {
    color: '#374151',
    fontSize: 16,
    textAlign: 'center',
  },
});

const markdownStyles = StyleSheet.create({
  text: {
    color: '#000000',
  },
  strong: {
    fontWeight: 'bold' as const, // Explicitly type as 'bold'
  },
});
