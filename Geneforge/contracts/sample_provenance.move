module geneforge::sample_provenance {
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use std::vector;
    use aptos_std::table::{Self, Table};
    
    // Error codes
    const E_SAMPLE_ALREADY_EXISTS: u64 = 1;
    const E_SAMPLE_NOT_FOUND: u64 = 2;
    const E_NOT_AUTHORIZED: u64 = 3;
    
    // Sample struct to store genetic sample data
    struct Sample has key, store, drop {
        id: String,
        sample_type: String,
        origin: String,
        metadata: String,
        owner: address,
        timestamp: u64,
        // Track all transfers and modifications
        history: vector<HistoryEntry>,
    }
    
    // History entry for tracking changes
    struct HistoryEntry has store, drop {
        timestamp: u64,
        action: String,
        actor: address,
        notes: String,
    }

    // Lab registry to track authorized labs
    struct LabRegistry has key {
        labs: Table<address, LabInfo>,
    }
    
    // Lab information
    struct LabInfo has store, drop {
        name: String,
        certification: String,
        is_active: bool,
    }

    // Resource for storing samples by a user
    struct SampleStore has key {
        samples: Table<String, Sample>, // Map of sample_id -> Sample
    }

    // Initialize the module
    fun init_module(account: &signer) {
        let lab_registry = LabRegistry {
            labs: table::new(),
        };
        move_to(account, lab_registry);
    }

    // Register a new lab
    public entry fun register_lab(
        admin: &signer,
        lab_address: address,
        name: String,
        certification: String
    ) acquires LabRegistry {
        let admin_addr = signer::address_of(admin);
        
        // In a real implementation, we would check if the admin has the right to add labs
        // For demo purposes, we'll allow anyone to register a lab
        
        let lab_registry = borrow_global_mut<LabRegistry>(@geneforge);
        
        let lab_info = LabInfo {
            name,
            certification,
            is_active: true,
        };
        
        table::upsert(&mut lab_registry.labs, lab_address, lab_info);
    }
    
    // Initialize a user's sample store if it doesn't exist
    fun init_sample_store_if_needed(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<SampleStore>(addr)) {
            move_to(account, SampleStore {
                samples: table::new(),
            });
        }
    }
    
    // Track a new genetic sample
    public entry fun track_sample(
        account: &signer,
        id: String,
        sample_type: String,
        origin: String,
        metadata: String
    ) acquires SampleStore {
        let owner = signer::address_of(account);
        
        // Initialize sample store if not exists
        init_sample_store_if_needed(account);

        let sample_store = borrow_global_mut<SampleStore>(owner);
        
        // Check if sample already exists
        assert!(!table::contains(&sample_store.samples, id), E_SAMPLE_ALREADY_EXISTS);
        
        // Create history entry for sample creation
        let history_entry = HistoryEntry {
            timestamp: timestamp::now_seconds(),
            action: string::utf8(b"CREATED"),
            actor: owner,
            notes: string::utf8(b"Initial sample registration"),
        };

        let history = vector::empty<HistoryEntry>();
        vector::push_back(&mut history, history_entry);
        
        // Create and store the sample
        let sample = Sample {
            id,
            sample_type,
            origin,
            metadata,
            owner,
            timestamp: timestamp::now_seconds(),
            history,
        };
        
        table::add(&mut sample_store.samples, id, sample);
    }

    // Transfer sample ownership
    public entry fun transfer_sample(
        from_account: &signer,
        to_address: address,
        sample_id: String,
        notes: String
    ) acquires SampleStore {
        let from_addr = signer::address_of(from_account);
        
        // Check that both accounts have a sample store
        assert!(exists<SampleStore>(from_addr), E_SAMPLE_NOT_FOUND);
        
        // Initialize the recipient's sample store if needed
        if (!exists<SampleStore>(to_address)) {
            // This would normally fail because we can't move_to another account directly
            // In a real implementation, the recipient would need to init their own store first
            // For demo purposes, we'll just abort if the recipient doesn't have a store
            abort E_NOT_AUTHORIZED
        };
        
        let from_store = borrow_global_mut<SampleStore>(from_addr);
        
        // Check if the sample exists
        assert!(table::contains(&from_store.samples, sample_id), E_SAMPLE_NOT_FOUND);
        
        // Get and remove the sample from the origin
        let sample = table::remove(&mut from_store.samples, sample_id);
        
        // Create history entry for transfer
        let history_entry = HistoryEntry {
            timestamp: timestamp::now_seconds(),
            action: string::utf8(b"TRANSFERRED"),
            actor: from_addr,
            notes,
        };
        vector::push_back(&mut sample.history, history_entry);
        
        // Update the owner
        sample.owner = to_address;
        
        // Add the sample to the recipient's store
        let to_store = borrow_global_mut<SampleStore>(to_address);
        table::add(&mut to_store.samples, sample_id, sample);
    }

    // Update sample metadata
    public entry fun update_sample_metadata(
        account: &signer,
        sample_id: String,
        new_metadata: String,
        notes: String
    ) acquires SampleStore {
        let addr = signer::address_of(account);
        
        assert!(exists<SampleStore>(addr), E_SAMPLE_NOT_FOUND);
        let sample_store = borrow_global_mut<SampleStore>(addr);
        
        // Check if the sample exists
        assert!(table::contains(&sample_store.samples, sample_id), E_SAMPLE_NOT_FOUND);
        
        let sample = table::borrow_mut(&mut sample_store.samples, sample_id);
        
        // Create history entry for metadata update
        let history_entry = HistoryEntry {
            timestamp: timestamp::now_seconds(),
            action: string::utf8(b"METADATA_UPDATED"),
            actor: addr,
            notes,
        };
        vector::push_back(&mut sample.history, history_entry);
        
        // Update the metadata
        sample.metadata = new_metadata;
    }
    
    // Get sample information (view function)
    #[view]
    public fun get_sample_info(owner: address, sample_id: String): (String, String, String, address, u64) acquires SampleStore {
        assert!(exists<SampleStore>(owner), E_SAMPLE_NOT_FOUND);
        let sample_store = borrow_global<SampleStore>(owner);
        
        assert!(table::contains(&sample_store.samples, sample_id), E_SAMPLE_NOT_FOUND);
        let sample = table::borrow(&sample_store.samples, sample_id);
        
        (
            sample.sample_type,
            sample.origin,
            sample.metadata,
            sample.owner,
            sample.timestamp
        )
    }
    
    // Get sample history (view function)
    #[view]
    public fun get_sample_history(owner: address, sample_id: String): vector<HistoryEntry> acquires SampleStore {
        assert!(exists<SampleStore>(owner), E_SAMPLE_NOT_FOUND);
        let sample_store = borrow_global<SampleStore>(owner);
        
        assert!(table::contains(&sample_store.samples, sample_id), E_SAMPLE_NOT_FOUND);
        let sample = table::borrow(&sample_store.samples, sample_id);
        
        sample.history
    }
    
    // Verify if a lab is certified (view function)
    #[view]
    public fun is_certified_lab(lab_address: address): bool acquires LabRegistry {
        let lab_registry = borrow_global<LabRegistry>(@geneforge);
        
        if (!table::contains(&lab_registry.labs, lab_address)) {
            return false
        };
        
        let lab_info = table::borrow(&lab_registry.labs, lab_address);
        lab_info.is_active
    }
}
