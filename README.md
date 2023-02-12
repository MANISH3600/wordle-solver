# wordle-solver
this can be used to recommend words in [wordle](https://www.nytimes.com/games/wordle/) after you've tried a few words

Example payload

```
{
    "notIn": ["e","r","t","i","p","s","d","g","h","k","l","c","n"],
    "correct": [
        {
            "letter": "u",
            "position": 2
        }
    ],
    "incorrect": [
        {
            "letter": "o",
            "position": 1
        },
        {
            "letter": "o",
            "position": 3
        }
    ]
}
```
