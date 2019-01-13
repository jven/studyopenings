import { PgnParser, ParsedVariation } from './pgnparser';

it('empty pgn throws', () => {
  expect(() => PgnParser.parse('')).toThrow();
});

it('one move with result', () => {
  assertParse(
      '1. e4 *',
      [
        { moves: [{ move: "e4" }] }
      ]);
});

it('one move without result', () => {
  assertParse(
      '1. e4',
      [
        { moves: [{ move: "e4" }] }
      ]);
});

it('many moves with result', () => {
  assertParse(
      '1. e4 e5 2. Nf3 Nc6 3. Bb5 *',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            { move: "Nf3" },
            { move: "Nc6" },
            { move: "Bb5" }
          ]
        }
      ]);
});

it('many moves without result', () => {
  assertParse(
      '1. e4 e5 2. Nf3 Nc6 3. Bb5',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            { move: "Nf3" },
            { move: "Nc6" },
            { move: "Bb5" }
          ]
        }
      ]);
});

it('headers', () => {
  assertParse(
      '[Event "myEvent"]\n[Site "mySite"]\n\n1. e4 e5 2. Nf3 *',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            { move: "Nf3" }
          ]
        }
      ]);
});

it('one game comment', () => {
  assertParse(
      '{ This is a great game. }\n\n1. e4 e5 2. Nf3',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            { move: "Nf3" }
          ]
        }
      ]);
});

it('many game comments', () => {
  assertParse(
      '{ This }{ is }  { a }\n{ great game. } 1. e4 e5 2. Nf3 *',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            { move: "Nf3" }
          ]
        }
      ]);
});

it('one move comment', () => {
  assertParse(
      '1. e4 { Best by test! } e5 2. Nf3',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            { move: "Nf3" }
          ]
        }
      ]);
});

it('many move comments', () => {
  assertParse(
      '1. e4 { Best by test! } e5 { Nice move. }{ I mean } { it } 2. Nf3 *',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            { move: "Nf3" }
          ]
        }
      ]);
});

it('one rav', () => {
  assertParse(
      '1. e4 e5 2. Nf3 (2. d4 exd4 3. Qxd4) Nc6 3. Bb5',
      [
        {
          moves: [
            { move: "e4" },
            { move: "e5" },
            {
              move: "Nf3",
              ravs: [
                {
                  moves: [
                    { move: "d4" },
                    { move: "exd4" },
                    { move: "Qxd4" }
                  ]
                }
              ]
            },
            { move: "Nc6" },
            { move: "Bb5" }
          ]
        }
      ]);
});

it('many ravs', () => {
  assertParse(
      '1. e4 e5 (1... e6 2. d4 (2. Nf3 1-0) 2... d5) 2. Nf3 (2. d4 exd4 3. Qxd4) Nc6 3. Bb5 (3. Ba6) (3. h3) 0-1',
      [
        {
          moves: [
            { move: "e4" },
            {
              move: "e5",
              ravs: [
                {
                  moves: [
                    { move: "e6" },
                    {
                      move: "d4",
                      ravs: [{ moves: [{ move: "Nf3" }] }]
                    },
                    { move: "d5" }
                  ]
                }
              ]
            },
            {
              move: "Nf3",
              ravs: [
                {
                  moves: [
                    { move: "d4" },
                    { move: "exd4" },
                    { move: "Qxd4" }
                  ]
                }
              ]
            },
            { move: "Nc6" },
            {
              move: "Bb5",
              ravs: [
                { moves: [{ move: "Ba6" }] },
                { moves: [{ move: "h3" }] }
              ]
            }
          ]
        }
      ]);
});

it('many games with results', () => {
  assertParse(
      '1. e4 *\n\n1. d4 *\n\n1. c4 *',
      [
        { moves: [{ move: "e4" }] },
        { moves: [{ move: "d4" }] },
        { moves: [{ move: "c4" }] }
      ]
  )
});

it('many games with comments', () => {
  assertParse(
      '[Event "event1"]\n1. e4\n\n[Event "event2"]\n1. d4\n\n[Event "event3"]\n1. c4',
      [
        { moves: [{ move: "e4" }] },
        { moves: [{ move: "d4" }] },
        { moves: [{ move: "c4" }] }
      ]
  )
});

function assertParse(pgn: string, expected: Object) {
  expect(PgnParser.parse(pgn)).toMatchObject(expected);
}