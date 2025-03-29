class ListNode {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }

    static print(out, node) {
        let current = node;
        while (current !== null) {
            out(current.data + " ");
            current = current.next;
        }
    }

    static length(node) {
        let size = 0;
        let current = node;
        while (current !== null) {
            size++;
            current = current.next;
        }
        return size;
    }

    static find(key, node) {
        let current = node;
        while (current !== null) {
            if (current.data === key) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    static deleteList(node) {
        while (node !== null) {
            let temp = node;
            node = node.next;
            temp = null;
        }
    }

    static remove(key, node) {
        let prev = null;
        let current = node;

        while (current !== null) {
            if (current.data === key) {
                if (prev) {
                    prev.next = current.next;
                } else {
                    node = current.next;
                }
                current = null; // free the node in JavaScript style
                break;
            }
            prev = current;
            current = current.next;
        }
        return node;
    }

    static insert(key, node) {
        return new ListNode(key, node);
    }
}

class Hasher {
    constructor(name) {
        this.name = name;
    }

    hash(key, N) {
        throw new Error("hash() must be implemented by subclass");
    }
}

class STLHasher extends Hasher {
    constructor() {
        super("STLHasher");
    }

    hash(key, N) {
        let hashValue = 0;
        for (let i = 0; i < key.length; i++) {
            hashValue = (hashValue * 31 + key.charCodeAt(i)) % N;
        }
        return hashValue % N;
    }
}

class HashTable {
    constructor(capacity, hasher = new STLHasher()) {
        this.capacity = capacity;
        this.hasher = hasher;
        this.buf = Array(capacity).fill(null);
    }

    insert(word) {
        const hashVal = this.hasher.hash(word, this.capacity);
        this.buf[hashVal] = ListNode.insert(word, this.buf[hashVal]);
    }

    find(word) {
        const hashVal = this.hasher.hash(word, this.capacity);
        return ListNode.find(word, this.buf[hashVal]) !== null;
    }

    remove(word) {
        const hashVal = this.hasher.hash(word, this.capacity);
        this.buf[hashVal] = ListNode.remove(word, this.buf[hashVal]);
    }

    isEmpty() {
        return this.buf.every(node => node === null);
    }

    isFull() {
        return false; 
    }

    print(out) {
        this.buf.forEach(node => {
            if (node) {
                ListNode.print(out, node);
            }
        });
    }

    numberOfEntries() {
        let size = 0;
        this.buf.forEach(node => {
            size += ListNode.length(node);
        });
        return size;
    }

    numberOfChains() {
        return this.capacity;
    }

    getChainLengths() {
        return this.buf.map(node => ListNode.length(node));
    }

    deleteTable() {
        this.buf.forEach(node => ListNode.deleteList(node));
        this.buf = null;
    }
}

function error(word, msg) {
    console.error(`Error in: ${word}. The message is: ${msg}`);
}
