import { useState } from "react";

class TrieNode {
    constructor(trie) {
        if (trie) {
            this.children = trie.children;
            this.isEndOfWord = trie.isEndOfWord;
        } else {
            this.children = {};
            this.isEndOfWord = false;
        }
    }
}



export default function useTrie() {
    const [root, setRoot] = useState(new TrieNode());

    const insertWord = (word) => {
        let node = root;
        for (let i = 0; i < word.length; i++) {
            let char = word.charAt(i);
            if (!(char in node.children)) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        setRoot(new TrieNode(root))
    }

    const _deleteHelper = (node, word, index) => {
        if (index == word.length) {
            if (node.isEndOfWord) {
                node.isEndOfWord = false;
            }
            return Object.keys(node.children).length == 0;
        }
        let char = word[index];
        if (!(char in node.children)) {
            return false;
        }
        let childNode = node.children[char];
        let shouldDelete = _deleteHelper(childNode, word, index + 1)
        if (shouldDelete) {
            delete node.children[char];
            return Object.keys(node.children).length == 0 && !node.isEndOfWord;
        }
        return false;
    }

    const deleteWord = (word) => {
        _deleteHelper(root, word, 0);
        setRoot(new TrieNode(root))
    }
    
    const exists = (word) => {
        let node = root;
        for (let i = 0; i < word.length; i++) {
            let char = word.charAt(i);
            if (!(char in node.children)) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEndOfWord;
    }

    const _findWordsFromNode = (node, prefix) => {
        let words = [];
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        for (let char of Object.keys(node.children)) {
            let childNode = node.children[char];
            for (let word of _findWordsFromNode(childNode, prefix + char)) {
                words.push(word);
            }
        }
        return words;
    }
    
    const autoComplete = (prefix) => {
        let node = root;
        for (let i = 0; i < prefix.length; i++) {
            let char = prefix.charAt(i);
            if (!(char in node.children)) {
                return [];
            }
            node = node.children[char];
        }
        return _findWordsFromNode(node, prefix);
    }

    return [insertWord, deleteWord, autoComplete, exists];
}