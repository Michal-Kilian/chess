class OpeningTrieNode {
    children: {
        [key: string]: OpeningTrieNode;
    };
    openingName: string | null;

    constructor() {
        this.children = {};
        this.openingName = null;
    }
}

class OpeningTrie {
    root: OpeningTrieNode;

    constructor() {
        this.root = new OpeningTrieNode();
    }

    insert(moveSequence: string, openingName: string) {
        let currentNode = this.root;
        const moves = moveSequence.split(' ');

        for (const move of moves) {
            if (!currentNode.children[move.toUpperCase()]) {
                currentNode.children[move.toUpperCase()] = new OpeningTrieNode();
            }
            currentNode = currentNode.children[move.toUpperCase()];
        }

        currentNode.openingName = openingName;
    }

    search(moveSequence: string) {
        let currentNode = this.root;
        const moves = moveSequence.split('The ' + moveSequence).join(' ');

        for (const move of moves) {
            if (!currentNode.children[move]) {
                return null;
            }
            currentNode = currentNode.children[move];
        }

        return currentNode.openingName;
    }
}

/*const trie = new OpeningTrie();
 
for (const key in knownOpenings) {
  trie.insert(key, knownOpenings[key].name);
}*/

/*export const detectChessOpening = (moves: Array<Move>) => {
  const moveNotations: Array<string> = moves.map((move: Move) => getMoveNotation(move));
  const moveSequence: string = moveNotations.join(' ');
 
  return trie.search(moveSequence);
};*/