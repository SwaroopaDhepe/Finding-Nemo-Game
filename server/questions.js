// server/questions.js
// 45 Progressive, Interconnected Questions (15 Excel, 15 Python, 15 SQL)
// + Bruce's Shark Attack Bonus Questions

export const SECTIONS = {
  excel: {
    id: 'excel',
    title: "Dory's Spreadsheet Challenge",
    subtitle: "Navigate the digital logbook of the S.S. Coral Reef",
    icon: "Table",
    badge: "Excel Mastery",
    description: "Solve formulas, cell references, lookups, and nested logic to decrypt the navigation coordinates and guide Dory to Nemo."
  },
  python: {
    id: 'python',
    title: "Crush's Code Quest",
    subtitle: "Surf the East Australian Current with Python algorithms",
    icon: "Code2",
    badge: "Python Logic",
    description: "Evaluate expressions, slice currents, trace loops, and run turtle algorithms to locate Nemo's coordinates in the EAC."
  },
  sql: {
    id: 'sql',
    title: "The Sunken Database",
    subtitle: "Query the ancient OceanDB research submarine",
    icon: "Database",
    badge: "SQL Queries",
    description: "Filter sightings, aggregate depths, join marine life logs, and extract the secret transponder signal pointing to Nemo's anemone."
  }
};

export const QUESTIONS = {
  excel: [
    {
      id: "ex_1",
      number: 1,
      story: "Dory starts the expedition at the S.S. Coral wreck! First, she must compute the total battery power from the 5 emergency sub-cells in cells B2:B6.",
      question: "Given cells B2 = 25, B3 = 40, B4 = 15, B5 = 30, and B6 = 10, what is the output of `=SUM(B2:B6)`?",
      code: "Cells:\nB2: 25 | B3: 40 | B4: 15 | B5: 30 | B6: 10\nFormula: =SUM(B2:B6)",
      options: [
        { key: "A", text: "110" },
        { key: "B", text: "120" },
        { key: "C", text: "125" },
        { key: "D", text: "130" }
      ],
      correctKey: "B",
      clue: "Battery Power = 120 Units",
      explanation: "SUM(25, 40, 15, 30, 10) = 120. Battery power is verified at 120 units for Dory's journey."
    },
    {
      id: "ex_2",
      number: 2,
      story: "With Battery Power = 120 (from Q1) stored in cell B7, Dory consults the navigation guide to determine the initial ocean drift direction.",
      question: "What value does the formula `=IF(B7 >= 100, \"EAST\", \"WEST\")` return when B7 is 120?",
      code: "Cell B7: 120\nFormula: =IF(B7 >= 100, \"EAST\", \"WEST\")",
      options: [
        { key: "A", text: "\"WEST\"" },
        { key: "B", text: "\"EAST\"" },
        { key: "C", text: "TRUE" },
        { key: "D", text: "#VALUE!" }
      ],
      correctKey: "B",
      clue: "Heading = \"EAST\"",
      explanation: "Since 120 >= 100 is TRUE, the IF condition evaluates to \"EAST\". Dory heads East!"
    },
    {
      id: "ex_3",
      number: 3,
      story: "Dory heads EAST! She now counts the active sonar waypoints in range A1:A5 (which contains the 5 waypoint IDs [101, 102, 103, 104, 105]) and combines it with her heading length.",
      question: "Cell C1 contains \"EAST\". If cells A1:A5 contain 5 numbers, what is the result of `=LEN(C1) + COUNT(A1:A5)`?",
      code: "C1: \"EAST\"\nA1:A5: [101, 102, 103, 104, 105]\nFormula: =LEN(C1) + COUNT(A1:A5)",
      options: [
        { key: "A", text: "8" },
        { key: "B", text: "9" },
        { key: "C", text: "10" },
        { key: "D", text: "4" }
      ],
      correctKey: "B",
      clue: "Waypoint Frequency = 9 kHz",
      explanation: "LEN(\"EAST\") is 4. COUNT(A1:A5) counts 5 numerical cells. 4 + 5 = 9."
    },
    {
      id: "ex_4",
      number: 4,
      story: "Dory needs to copy a formula down the sonar grid. In cell C1, the formula is `=$A$1 * B1`. What happens when she copies it down to row 3 (cell C3)?",
      question: "What is the exact formula in cell C3 after copying `=$A$1 * B1` from C1 down to C3?",
      code: "Source Cell C1: =$A$1 * B1\nAction: Drag/Copy to cell C3",
      options: [
        { key: "A", text: "=$A$3 * B3" },
        { key: "B", text: "=$A$1 * B1" },
        { key: "C", text: "=$A$1 * B3" },
        { key: "D", text: "=A1 * B3" }
      ],
      correctKey: "C",
      clue: "Anchor Lock: $A$1 is locked, row relative multiplier moves to B3",
      explanation: "$A$1 uses absolute referencing for both column and row, so it stays $A$1. B1 is relative, so moving down 2 rows changes it to B3."
    },
    {
      id: "ex_5",
      number: 5,
      story: "Dory enters deep waters and scans 10 reef depth zones in D2:D11: `[8, 16, 22, 12, 19, 30, 14, 5, 25, 10]`. She needs to count safe zones deeper than 15 fathoms.",
      question: "What is the output of `=COUNTIF(D2:D11, \">15\")`?",
      code: "Range D2:D11: 8, 16, 22, 12, 19, 30, 14, 5, 25, 10\nFormula: =COUNTIF(D2:D11, \">15\")",
      options: [
        { key: "A", text: "4" },
        { key: "B", text: "5" },
        { key: "C", text: "6" },
        { key: "D", text: "7" }
      ],
      correctKey: "B",
      clue: "Safe Deep Zones = 5",
      explanation: "The numbers strictly greater than 15 are 16, 22, 19, 30, and 25 (exactly 5 values)."
    },
    {
      id: "ex_6",
      number: 6,
      story: "The submarine log has a code `\"REEF_SECTOR_7\"` in cell E1. Dory takes the first 4 letters and appends her Safe Deep Zones count (5 from Q5 in cell E2).",
      question: "What is the output of `=LEFT(E1, 4) & E2`?",
      code: "Cell E1: \"REEF_SECTOR_7\"\nCell E2: 5\nFormula: =LEFT(E1, 4) & E2",
      options: [
        { key: "A", text: "\"REEF_5\"" },
        { key: "B", text: "\"REEF5\"" },
        { key: "C", text: "\"SECT5\"" },
        { key: "D", text: "\"REEF 5\"" }
      ],
      correctKey: "B",
      clue: "Sector Tag = \"REEF5\"",
      explanation: "LEFT(\"REEF_SECTOR_7\", 4) returns \"REEF\". Concatenating with 5 yields \"REEF5\"."
    },
    {
      id: "ex_7",
      number: 7,
      story: "Dory tests the submarine safety checklist using the parameters discovered so far: Safe Zones (5), Heading (\"EAST\"), and Battery (120).",
      question: "What is the result of `=AND(5 > 3, \"EAST\" = \"EAST\", 120 <= 150)` in Excel?",
      code: "Formula: =AND(5 > 3, \"EAST\" = \"EAST\", 120 <= 150)",
      options: [
        { key: "A", text: "TRUE" },
        { key: "B", text: "FALSE" },
        { key: "C", text: "#NAME?" },
        { key: "D", text: "1" }
      ],
      correctKey: "A",
      clue: "Safety Status = TRUE (All systems clear)",
      explanation: "5 > 3 is TRUE, \"EAST\" = \"EAST\" is TRUE, and 120 <= 150 is TRUE. Since all conditions are TRUE, AND returns TRUE."
    },
    {
      id: "ex_8",
      number: 8,
      story: "Dory inspects sensor readings in cells F1:F5 containing: `[15, \"Coral\", 45, \"\", 60]`. Cell F4 is an empty string `\"\"` generated by a formula.",
      question: "What is the difference between `=COUNTA(F1:F5)` and `=COUNT(F1:F5)`?",
      code: "Cells F1:F5: 15, \"Coral\", 45, \"\" (empty text), 60\nFormula: =COUNTA(F1:F5) - COUNT(F1:F5)",
      options: [
        { key: "A", text: "0" },
        { key: "B", text: "1" },
        { key: "C", text: "2" },
        { key: "D", text: "3" }
      ],
      correctKey: "C",
      clue: "Data Discrepancy = 2 non-numeric non-empty cells",
      explanation: "COUNT counts only numeric cells (15, 45, 60 = 3). COUNTA counts non-empty cells (including text \"Coral\" and formula empty string \"\", so 4+1 = 4 or 5: F1, F2, F3, F4 are non-empty = 4 non-empty, plus F5 is 5 total; 5 - 3 = 2)."
    },
    {
      id: "ex_9",
      number: 9,
      story: "Dory categorizes water depth using the battery/speed value 120 (from Q1) stored in cell A1.",
      question: "What will `=IF(A1 > 100, IF(A1 > 150, \"ABYSS\", \"MID_TRENCH\"), \"SHALLOW\")` return when A1 = 120?",
      code: "A1: 120\nFormula: =IF(A1 > 100, IF(A1 > 150, \"ABYSS\", \"MID_TRENCH\"), \"SHALLOW\")",
      options: [
        { key: "A", text: "\"ABYSS\"" },
        { key: "B", text: "\"MID_TRENCH\"" },
        { key: "C", text: "\"SHALLOW\"" },
        { key: "D", text: "FALSE" }
      ],
      correctKey: "B",
      clue: "Ocean Layer = \"MID_TRENCH\"",
      explanation: "A1 > 100 is TRUE (120 > 100). Next, A1 > 150 is FALSE (120 is not > 150). Hence, it evaluates to \"MID_TRENCH\"."
    },
    {
      id: "ex_10",
      number: 10,
      story: "Dory looks up the current velocity at \"MID_TRENCH\" in an ocean lookup table: [\"SHALLOW\", 12; \"MID_TRENCH\", 28; \"ABYSS\", 45].",
      question: "Given table A1:B3 with Column A (Zone) and Column B (Knots), what does `=VLOOKUP(\"MID_TRENCH\", A1:B3, 2, FALSE)` return?",
      code: "Table A1:B3:\nRow 1: SHALLOW    | 12\nRow 2: MID_TRENCH | 28\nRow 3: ABYSS      | 45\nFormula: =VLOOKUP(\"MID_TRENCH\", A1:B3, 2, FALSE)",
      options: [
        { key: "A", text: "12" },
        { key: "B", text: "28" },
        { key: "C", text: "45" },
        { key: "D", text: "#N/A" }
      ],
      correctKey: "B",
      clue: "Current Velocity = 28 Knots",
      explanation: "VLOOKUP finds the exact match \"MID_TRENCH\" in Row 2, column 1, and retrieves column 2's value: 28."
    },
    {
      id: "ex_11",
      number: 11,
      story: "Dory calculates average sea temperature over 4 probe readings: 22.4, 24.8, 26.2, 21.8. Then she rounds the average to 1 decimal place.",
      question: "What is the result of `=ROUND(AVERAGE(22.4, 24.8, 26.2, 21.8), 1)`?",
      code: "Values: 22.4, 24.8, 26.2, 21.8\nSum: 95.2 | Count: 4\nFormula: =ROUND(AVERAGE(22.4, 24.8, 26.2, 21.8), 1)",
      options: [
        { key: "A", text: "23.6" },
        { key: "B", text: "23.8" },
        { key: "C", text: "24.0" },
        { key: "D", text: "24.2" }
      ],
      correctKey: "B",
      clue: "Water Temperature = 23.8 °C",
      explanation: "Sum = 95.2. 95.2 / 4 = 23.8. Rounded to 1 decimal place is 23.8."
    },
    {
      id: "ex_12",
      number: 12,
      story: "Dory encounters a damaged formula in the navigation log that attempts `=B2 / C2` where B2 is 100 and C2 is 0.",
      question: "Which Excel error code is displayed when a cell attempts to divide by zero?",
      code: "Cell B2: 100\nCell C2: 0\nFormula: =B2 / C2",
      options: [
        { key: "A", text: "#VALUE!" },
        { key: "B", text: "#REF!" },
        { key: "C", text: "#DIV/0!" },
        { key: "D", text: "#NULL!" }
      ],
      correctKey: "C",
      clue: "Error Type = #DIV/0! (Handled by IFERROR default 0)",
      explanation: "In Excel, dividing any number by 0 or an empty cell produces the #DIV/0! error."
    },
    {
      id: "ex_13",
      number: 13,
      story: "To stabilize the formula from Q12, Dory wraps it in IFERROR: `=IFERROR(B2/C2, 50) + 14`. With B2=100 and C2=0, what is the output?",
      question: "What is the output of `=IFERROR(B2/C2, 50) + 14` when B2=100 and C2=0?",
      code: "B2: 100 | C2: 0\nFormula: =IFERROR(B2/C2, 50) + 14",
      options: [
        { key: "A", text: "64" },
        { key: "B", text: "50" },
        { key: "C", text: "#DIV/0!" },
        { key: "D", text: "14" }
      ],
      correctKey: "A",
      clue: "Stabilized Depth Offset = 64 Meters",
      explanation: "B2/C2 throws #DIV/0!, so IFERROR catches it and returns the fallback value 50. Then 50 + 14 = 64."
    },
    {
      id: "ex_14",
      number: 14,
      story: "Dory builds the transponder frequency code using the Sector Tag (\"REEF5\" from Q6) and Depth Offset (64 from Q13).",
      question: "In Excel, what is the result of `=UPPER(MID(\"Reef5_Signal\", 1, 5)) & \"_\" & TEXT(64, \"000\")`?",
      code: "Formula: =UPPER(MID(\"Reef5_Signal\", 1, 5)) & \"_\" & TEXT(64, \"000\")",
      options: [
        { key: "A", text: "\"REEF5_64\"" },
        { key: "B", text: "\"REEF5_064\"" },
        { key: "C", text: "\"reef5_064\"" },
        { key: "D", text: "\"REEF_064\"" }
      ],
      correctKey: "B",
      clue: "Transponder Code = \"REEF5_064\"",
      explanation: "MID(\"Reef5_Signal\", 1, 5) extracts \"Reef5\". UPPER turns it into \"REEF5\". TEXT(64, \"000\") formats 64 as \"064\". Concatenated: \"REEF5_064\"."
    },
    {
      id: "ex_15",
      number: 15,
      story: "FINAL CLUE! Dory inputs the Transponder Code \"REEF5_064\" into the submarine terminal. If the code length equals 9 AND right 3 digits equal \"064\", Nemo's Anemone coordinates unlock!",
      question: "What does `=IF(AND(LEN(\"REEF5_064\")=9, RIGHT(\"REEF5_064\", 3)=\"064\"), \"NEMO_FOUND_AT_ANEMONE_42\", \"LOST\")` return?",
      code: "Code: \"REEF5_064\"\nFormula: =IF(AND(LEN(\"REEF5_064\")=9, RIGHT(\"REEF5_064\", 3)=\"064\"), \"NEMO_FOUND_AT_ANEMONE_42\", \"LOST\")",
      options: [
        { key: "A", text: "\"LOST\"" },
        { key: "B", text: "\"NEMO_FOUND_AT_ANEMONE_42\"" },
        { key: "C", text: "TRUE" },
        { key: "D", text: "#VALUE!" }
      ],
      correctKey: "B",
      clue: "MISSION ACCOMPLISHED: NEMO FOUND AT ANEMONE 42!",
      explanation: "LEN(\"REEF5_064\") is 9 (TRUE). RIGHT(\"REEF5_064\", 3) is \"064\" (TRUE). AND(TRUE, TRUE) is TRUE, returning \"NEMO_FOUND_AT_ANEMONE_42\"!"
    }
  ],

  python: [
    {
      id: "py_1",
      number: 1,
      story: "Crush the sea turtle invites your team to surf the East Australian Current! First, calculate your initial swimming velocity using integer division and modulo.",
      question: "What is the output of the following Python expression?",
      code: "speed = (12 * 4) // 3 + (17 % 5)\nprint(speed)",
      options: [
        { key: "A", text: "16" },
        { key: "B", text: "18" },
        { key: "C", text: "19" },
        { key: "D", text: "18.0" }
      ],
      correctKey: "B",
      clue: "Initial Velocity: 18 knots",
      explanation: "(12 * 4) = 48. 48 // 3 = 16 (integer division). 17 % 5 = 2. 16 + 2 = 18."
    },
    {
      id: "py_2",
      number: 2,
      story: "Using velocity `speed = 18` from Q1, Crush locates your lane index in the EAC current streams list `[6, 12, 18, 24, 30]`.",
      question: "What is the output of this Python snippet?",
      code: "speed = 18\nstreams = [6, 12, 18, 24, 30]\nlane = streams.index(speed) * 3\nprint(lane)",
      options: [
        { key: "A", text: "3" },
        { key: "B", text: "6" },
        { key: "C", text: "9" },
        { key: "D", text: "12" }
      ],
      correctKey: "B",
      clue: "Current Stream Lane = 6",
      explanation: "streams.index(18) finds 18 at index 2 (0-indexed: 6 is 0, 12 is 1, 18 is 2). 2 * 3 = 6."
    },
    {
      id: "py_3",
      number: 3,
      story: "Crush transmits a radio coordinate string to the turtle squad. Using Lane index = 6 from Q2, slice the coordinate code.",
      question: "What does this string slicing snippet output?",
      code: "signal = \"PACIFIC_OCEAN_EAC\"\n# lane = 6 from Q2\nsub = signal[6:12]\nprint(sub)",
      options: [
        { key: "A", text: "\"C_OCEA\"" },
        { key: "B", text: "\"IC_OCE\"" },
        { key: "C", text: "\"_OCEAN\"" },
        { key: "D", text: "\"OCEAN_\"" }
      ],
      correctKey: "A",
      clue: "Extracted Signal = \"C_OCEA\"",
      explanation: "signal[6:12] starts at index 6 and stops before index 12: index 6='C', 7='_', 8='O', 9='C', 10='E', 11='A' -> \"C_OCEA\"."
    },
    {
      id: "py_4",
      number: 4,
      story: "Crush checks weather conditions for the EAC tube ride using Boolean operators with `speed = 18` and `lane = 6`.",
      question: "What is the boolean result of this Python expression?",
      code: "speed = 18\nlane = 6\nis_safe = (speed > 15) and not (lane == 5 or False)\nprint(is_safe)",
      options: [
        { key: "A", text: "True" },
        { key: "B", text: "False" },
        { key: "C", text: "None" },
        { key: "D", text: "Error" }
      ],
      correctKey: "A",
      clue: "Current Condition: True (Smooth EAC tunnel ahead)",
      explanation: "(speed > 15) is True (18 > 15). (lane == 5 or False) is (6 == 5 or False) -> False. not(False) -> True. True and True -> True."
    },
    {
      id: "py_5",
      number: 5,
      story: "The turtle squad dives through 5 vortex rings. In each step, the drift distance accumulates with `range(1, 6)`.",
      question: "What is the final value of `total_drift` after the loop?",
      code: "total_drift = 0\nfor step in range(1, 6):\n    total_drift += step * 2\nprint(total_drift)",
      options: [
        { key: "A", text: "20" },
        { key: "B", text: "25" },
        { key: "C", text: "30" },
        { key: "D", text: "32" }
      ],
      correctKey: "C",
      clue: "Total Drift Distance = 30 Miles",
      explanation: "step values are 1, 2, 3, 4, 5. Added values are 2, 4, 6, 8, 10. Sum: 2 + 4 + 6 + 8 + 10 = 30."
    },
    {
      id: "py_6",
      number: 6,
      story: "Crush filters a list of ocean depths using drift distance 30 (from Q5) to find all depths divisible by 6.",
      question: "What is the result of this list comprehension in Python?",
      code: "depths = [10, 15, 20, 25, 30]\nfiltered = [d for d in depths if d % 6 == 0]\nprint(filtered)",
      options: [
        { key: "A", text: "[15, 30]" },
        { key: "B", text: "[30]" },
        { key: "C", text: "[10, 20, 30]" },
        { key: "D", text: "[]" }
      ],
      correctKey: "B",
      clue: "Filtered Target Depth = [30]",
      explanation: "Only 30 is divisible by 6 without remainder (30 % 6 == 0). The result is [30]."
    },
    {
      id: "py_7",
      number: 7,
      story: "Crush maintains a dictionary of marine life sightings along the EAC to track clownfish activity.",
      question: "What is the output of the following dictionary operation?",
      code: "reef_log = {\"Turtles\": 150, \"Jellyfish\": 40, \"Clownfish\": 1}\nreef_log[\"Clownfish\"] += 2\nreef_log.update({\"Sharks\": 3})\nprint(len(reef_log), reef_log[\"Clownfish\"])",
      options: [
        { key: "A", text: "3 1" },
        { key: "B", text: "4 3" },
        { key: "C", text: "4 2" },
        { key: "D", text: "3 3" }
      ],
      correctKey: "B",
      clue: "Tracked Clownfish Count = 3",
      explanation: "reef_log[\"Clownfish\"] increases from 1 to 3. Adding \"Sharks\": 3 makes 4 total keys: Turtles, Jellyfish, Clownfish, Sharks. Output: 4 3."
    },
    {
      id: "py_8",
      number: 8,
      story: "Crush defines an acceleration function to propel the turtles into the express current. Note the variable scoping!",
      question: "What does this code print?",
      code: "boost = 10\ndef accelerate(val):\n    boost = 5\n    return val + boost\n\nres = accelerate(20)\nprint(res, boost)",
      options: [
        { key: "A", text: "25 10" },
        { key: "B", text: "25 5" },
        { key: "C", text: "30 10" },
        { key: "D", text: "20 5" }
      ],
      correctKey: "A",
      clue: "Accelerated Vector = 25 (Global boost remains 10)",
      explanation: "Inside accelerate(), boost is local (5), returning 20 + 5 = 25. Outside the function, the global boost is still 10."
    },
    {
      id: "py_9",
      number: 9,
      story: "Crush cleans up an incoming sonar beacon text message before decoding.",
      question: "What is the output of this string transformation?",
      code: "raw_beacon = \"  Sydney_Harbour_Dropoff  \"\ncleaned = raw_beacon.strip().replace(\"Dropoff\", \"Reef\").upper()\nprint(cleaned)",
      options: [
        { key: "A", text: "\"SYDNEY_HARBOUR_DROPOFF\"" },
        { key: "B", text: "\"SYDNEY_HARBOUR_REEF\"" },
        { key: "C", text: "\"  SYDNEY_HARBOUR_REEF  \"" },
        { key: "D", text: "\"sydney_harbour_reef\"" }
      ],
      correctKey: "B",
      clue: "Cleaned Beacon = \"SYDNEY_HARBOUR_REEF\"",
      explanation: "strip() removes outer spaces. replace(\"Dropoff\", \"Reef\") changes it to \"Sydney_Harbour_Reef\". upper() converts all to uppercase: \"SYDNEY_HARBOUR_REEF\"."
    },
    {
      id: "py_10",
      number: 10,
      story: "Squirt, Crush's son, simulates a 2D turtle coordinate navigation algorithm starting from (x=0, y=0).",
      question: "What are the final coordinates (x, y) after executing this loop?",
      code: "x, y = 0, 0\nmoves = [('N', 10), ('E', 15), ('S', 4), ('W', 5)]\nfor dir, dist in moves:\n    if dir == 'N': y += dist\n    elif dir == 'S': y -= dist\n    elif dir == 'E': x += dist\n    elif dir == 'W': x -= dist\nprint(f\"{x},{y}\")",
      options: [
        { key: "A", text: "\"10,6\"" },
        { key: "B", text: "\"15,10\"" },
        { key: "C", text: "\"5,6\"" },
        { key: "D", text: "\"10,14\"" }
      ],
      correctKey: "A",
      clue: "Relative Grid Coordinate: (10, 6)",
      explanation: "x moves: +15 (E) - 5 (W) = 10. y moves: +10 (N) - 4 (S) = 6. Result: \"10,6\"."
    },
    {
      id: "py_11",
      number: 11,
      story: "Crush runs an error recovery algorithm when traversing the jellyfish cloud.",
      question: "What does this try-except-finally block output?",
      code: "val = 0\ntry:\n    val += 10\n    x = 10 / 2\n    val += int(x)\nexcept ZeroDivisionError:\n    val += 100\nfinally:\n    val += 5\nprint(val)",
      options: [
        { key: "A", text: "15" },
        { key: "B", text: "20" },
        { key: "C", text: "115" },
        { key: "D", text: "120" }
      ],
      correctKey: "B",
      clue: "Jellyfish Traversal Shield: 20 Units",
      explanation: "val starts at 0. try: val += 10 (val=10). 10/2=5.0, val += 5 (val=15). No exception is thrown, so except block is skipped. finally block always executes: val += 5 (val=20)."
    },
    {
      id: "py_12",
      number: 12,
      story: "Crush computes the intersection of species spotted in the Great Barrier Reef vs the EAC.",
      question: "What is the length of the resulting set?",
      code: "barrier_reef = {\"Clownfish\", \"Blue Tang\", \"Manta Ray\", \"Sea Turtle\"}\neac_current = {\"Sea Turtle\", \"Jellyfish\", \"Clownfish\", \"Whale\"}\ncommon = barrier_reef & eac_current\nprint(len(common))",
      options: [
        { key: "A", text: "1" },
        { key: "B", text: "2" },
        { key: "C", text: "3" },
        { key: "D", text: "4" }
      ],
      correctKey: "B",
      clue: "Common Navigator Species Count = 2 (Clownfish & Sea Turtle)",
      explanation: "The '&' operator performs set intersection. Common elements are {\"Clownfish\", \"Sea Turtle\"}, so length is 2."
    },
    {
      id: "py_13",
      number: 13,
      story: "Crush uses lambda and map to scale frequency pings [18, 30, 42] (which correspond to earlier speed and drift values!).",
      question: "What is the output of this Python map expression?",
      code: "frequencies = [18, 30, 42]\nscaled = list(map(lambda f: f // 6, frequencies))\nprint(scaled)",
      options: [
        { key: "A", text: "[3, 5, 7]" },
        { key: "B", text: "[2, 4, 6]" },
        { key: "C", text: "[3.0, 5.0, 7.0]" },
        { key: "D", text: "[18, 30, 42]" }
      ],
      correctKey: "A",
      clue: "Frequency Resonators = [3, 5, 7]",
      explanation: "18 // 6 = 3, 30 // 6 = 5, 42 // 6 = 7. Result is [3, 5, 7]."
    },
    {
      id: "py_14",
      number: 14,
      story: "Squirt sorts tuple coordinates of known clownfish nests by distance to find the closest one.",
      question: "What is the first element of the sorted list when sorted by distance?",
      code: "nests = [(\"Coral_Hollow\", 45), (\"Anemone_Cove\", 12), (\"Deep_Reef\", 28)]\nnests.sort(key=lambda item: item[1])\nprint(nests[0][0])",
      options: [
        { key: "A", text: "\"Coral_Hollow\"" },
        { key: "B", text: "\"Deep_Reef\"" },
        { key: "C", text: "\"Anemone_Cove\"" },
        { key: "D", text: "12" }
      ],
      correctKey: "C",
      clue: "Closest Sanctuary = \"Anemone_Cove\"",
      explanation: "Sorting by item[1] orders distances: 12, 28, 45. The first tuple is (\"Anemone_Cove\", 12), so nests[0][0] is \"Anemone_Cove\"."
    },
    {
      id: "py_15",
      number: 15,
      story: "FINAL EAC MISSION STEP! Crush combines the sanctuary name (\"Anemone_Cove\" from Q14) and grid coords (\"10,6\" from Q10) into the rescue verification hash.",
      question: "What does this final Python snippet output?",
      code: "sanctuary = \"Anemone_Cove\"\ncoord = \"10_6\"\nclue_key = f\"{sanctuary.upper()}_{coord}\"\nif clue_key == \"ANEMONE_COVE_10_6\":\n    print(\"NEMO_RESCUED_SUCCESS!\")\nelse:\n    print(\"SEARCH_AGAIN\")",
      options: [
        { key: "A", text: "\"SEARCH_AGAIN\"" },
        { key: "B", text: "\"NEMO_RESCUED_SUCCESS!\"" },
        { key: "C", text: "\"ANEMONE_COVE_10_6\"" },
        { key: "D", text: "SyntaxError" }
      ],
      correctKey: "B",
      clue: "MISSION ACCOMPLISHED: NEMO RESCUED AT ANEMONE COVE 10-6!",
      explanation: "sanctuary.upper() is \"ANEMONE_COVE\". clue_key becomes \"ANEMONE_COVE_10_6\". The equality is True, so \"NEMO_RESCUED_SUCCESS!\" is printed!"
    }
  ],

  sql: [
    {
      id: "sql_1",
      number: 1,
      story: "You power up the sunken research submarine's emergency terminal running OceanDB. First, inspect the `sightings` table to find all active clownfish pings.",
      question: "Given the sample table, what count does this SQL query return?",
      code: "-- Table: sightings\n-- id | species    | status   \n-- 1  | Clownfish  | Active   \n-- 2  | Blue Tang  | Active   \n-- 3  | Clownfish  | Active   \n-- 4  | Shark      | Inactive \n-- 5  | Clownfish  | Active   \n-- 6  | Sea Turtle | Active   \n-- 7  | Clownfish  | Active   \n\nSELECT COUNT(*) FROM sightings\nWHERE species = 'Clownfish' AND status = 'Active';",
      options: [
        { key: "A", text: "3" },
        { key: "B", text: "4" },
        { key: "C", text: "5" },
        { key: "D", text: "7" }
      ],
      correctKey: "B",
      clue: "Active Clownfish Pings = 4",
      explanation: "Rows with species = 'Clownfish' and status = 'Active' are rows 1, 3, 5, and 7 (total 4)."
    },
    {
      id: "sql_2",
      number: 2,
      story: "Using Active Pings = 4 from Q1, you calculate target depth = 4 * 100 = 400 fathoms in the `ocean_zones` table.",
      question: "Which zone name does this query retrieve?",
      code: "-- Table: ocean_zones\n-- zone_id | zone_name      | depth_fathoms\n-- Z1      | Sunlight_Zone  | 100\n-- Z2      | Twilight_Zone  | 400\n-- Z3      | Midnight_Zone  | 1000\n-- Z4      | Abyssal_Zone   | 2000\n\nSELECT zone_name FROM ocean_zones\nWHERE depth_fathoms = 400;",
      options: [
        { key: "A", text: "\"Sunlight_Zone\"" },
        { key: "B", text: "\"Twilight_Zone\"" },
        { key: "C", text: "\"Midnight_Zone\"" },
        { key: "D", text: "\"Abyssal_Zone\"" }
      ],
      correctKey: "B",
      clue: "Target Ocean Zone = \"Twilight_Zone\"",
      explanation: "Row Z2 has depth_fathoms = 400, matching zone_name 'Twilight_Zone'."
    },
    {
      id: "sql_3",
      number: 3,
      story: "You query salinity sensor readings in Twilight_Zone to find unique salinity concentrations.",
      question: "What is the output of `COUNT(DISTINCT salinity)` on this table?",
      code: "-- Table: salinity_readings\n-- id | zone_name     | salinity\n-- 1  | Twilight_Zone | 35.2\n-- 2  | Twilight_Zone | 35.5\n-- 3  | Twilight_Zone | 35.2\n-- 4  | Twilight_Zone | 35.8\n-- 5  | Sunlight_Zone | 34.0\n\nSELECT COUNT(DISTINCT salinity) FROM salinity_readings\nWHERE zone_name = 'Twilight_Zone';",
      options: [
        { key: "A", text: "2" },
        { key: "B", text: "3" },
        { key: "C", text: "4" },
        { key: "D", text: "5" }
      ],
      correctKey: "B",
      clue: "Distinct Salinity Levels = 3 (35.2, 35.5, 35.8)",
      explanation: "For 'Twilight_Zone', salinity values are 35.2, 35.5, 35.2, 35.8. Distinct values are 35.2, 35.5, and 35.8 (count = 3)."
    },
    {
      id: "sql_4",
      number: 4,
      story: "You calculate the average water temperature recorded in the marine log across 5 sensor buoys.",
      question: "What is the output of this aggregation query?",
      code: "-- Table: buoys\n-- buoy_id | temp_c\n-- B1      | 20.0\n-- B2      | 24.0\n-- B3      | 26.0\n-- B4      | 30.0\n-- B5      | 25.0\n\nSELECT AVG(temp_c) AS avg_temp FROM buoys;",
      options: [
        { key: "A", text: "24.0" },
        { key: "B", text: "25.0" },
        { key: "C", text: "26.0" },
        { key: "D", text: "27.5" }
      ],
      correctKey: "B",
      clue: "Average Ocean Temperature = 25.0 °C",
      explanation: "Sum of temps: 20 + 24 + 26 + 30 + 25 = 125. 125 / 5 = 25.0."
    },
    {
      id: "sql_5",
      number: 5,
      story: "You group submarine sector transmissions and filter out quiet areas using HAVING.",
      question: "How many sectors are returned by this query?",
      code: "-- Table: transmissions\n-- id | sector | signal_strength\n-- 1  | Alpha  | 80\n-- 2  | Alpha  | 90\n-- 3  | Alpha  | 75\n-- 4  | Beta   | 60\n-- 5  | Beta   | 85\n-- 6  | Gamma  | 95\n\nSELECT sector, COUNT(*) FROM transmissions\nGROUP BY sector\nHAVING COUNT(*) >= 2;",
      options: [
        { key: "A", text: "1 sector (Alpha)" },
        { key: "B", text: "2 sectors (Alpha, Beta)" },
        { key: "C", text: "3 sectors (Alpha, Beta, Gamma)" },
        { key: "D", text: "0 sectors" }
      ],
      correctKey: "B",
      clue: "High Transmission Sectors = 2 (Alpha and Beta)",
      explanation: "Alpha has 3 rows (>= 2). Beta has 2 rows (>= 2). Gamma has 1 row (< 2). Exactly 2 sectors satisfy HAVING COUNT(*) >= 2."
    },
    {
      id: "sql_6",
      number: 6,
      story: "You scan transponder codes using the SQL `LIKE` wildcard to match Nemo's transmitter pattern.",
      question: "Which of the following tag codes matches the condition `WHERE code LIKE 'NEMO_%_2026'`?",
      code: "Condition: WHERE code LIKE 'NEMO_%_2026'",
      options: [
        { key: "A", text: "'NEMO_2026'" },
        { key: "B", text: "'NEMO_REEF_2026'" },
        { key: "C", text: "'MY_NEMO_REEF_2026'" },
        { key: "D", text: "'NEMO_REEF_2025'" }
      ],
      correctKey: "B",
      clue: "Transmitter Pattern Matched = 'NEMO_REEF_2026'",
      explanation: "'NEMO_%_2026' requires starting with 'NEMO_', ending with '_2026', with at least one character in between for '%'. 'NEMO_REEF_2026' matches perfectly."
    },
    {
      id: "sql_7",
      number: 7,
      story: "You sort the detected marine life pings by depth descending and signal strength ascending to prioritize rescue coordinates.",
      question: "Which row appears first in the query result?",
      code: "-- Table: pings\n-- id | label     | depth | signal\n-- 1  | Ping_A    | 300   | 50\n-- 2  | Ping_B    | 500   | 80\n-- 3  | Ping_C    | 500   | 40\n-- 4  | Ping_D    | 200   | 90\n\nSELECT label FROM pings\nORDER BY depth DESC, signal ASC\nLIMIT 1;",
      options: [
        { key: "A", text: "\"Ping_A\"" },
        { key: "B", text: "\"Ping_B\"" },
        { key: "C", text: "\"Ping_C\"" },
        { key: "D", text: "\"Ping_D\"" }
      ],
      correctKey: "C",
      clue: "Top Priority Ping = \"Ping_C\" (Depth 500, Signal 40)",
      explanation: "Highest depth is 500 (Ping_B and Ping_C). For tie-breaker `signal ASC`, Ping_C has 40 vs Ping_B's 80. So Ping_C ranks first."
    },
    {
      id: "sql_8",
      number: 8,
      story: "You inspect sensor anomalies containing NULL values in the `hydrophone_logs` table.",
      question: "What values do `COUNT(*)` and `COUNT(sonar_freq)` return for this table?",
      code: "-- Table: hydrophone_logs\n-- id | buoy_name | sonar_freq\n-- 1  | North     | 120\n-- 2  | South     | NULL\n-- 3  | East      | 145\n-- 4  | West      | NULL\n-- 5  | Central   | 130\n\nSELECT COUNT(*), COUNT(sonar_freq) FROM hydrophone_logs;",
      options: [
        { key: "A", text: "5, 5" },
        { key: "B", text: "5, 3" },
        { key: "C", text: "3, 3" },
        { key: "D", text: "5, 2" }
      ],
      correctKey: "B",
      clue: "Active Frequencies = 3 (out of 5 total logs)",
      explanation: "COUNT(*) counts all rows including NULLs (5). COUNT(column_name) counts non-NULL values only (3). Output is 5, 3."
    },
    {
      id: "sql_9",
      number: 9,
      story: "You join the `clownfish_sightings` table with the `reef_sectors` table using an INNER JOIN on `sector_id`.",
      question: "How many rows are produced by this INNER JOIN?",
      code: "-- Table: sightings (4 rows: sector_id = 10, 20, 20, 30)\n-- Table: sectors   (3 rows: sector_id = 20, 30, 40)\n\nSELECT s.id, sec.name \nFROM sightings s\nINNER JOIN sectors sec ON s.sector_id = sec.sector_id;",
      options: [
        { key: "A", text: "2 rows" },
        { key: "B", text: "3 rows" },
        { key: "C", text: "4 rows" },
        { key: "D", text: "7 rows" }
      ],
      correctKey: "B",
      clue: "Joined Sighting Events = 3 rows",
      explanation: "Sector 20 matches two rows in sightings. Sector 30 matches one row in sightings. Sector 10 is not in sectors, and 40 is not in sightings. 2 + 1 = 3 rows."
    },
    {
      id: "sql_10",
      number: 10,
      story: "You perform a LEFT JOIN to find reef zones that have ZERO predator sightings recorded.",
      question: "Which condition in the WHERE clause finds zones without predators after a LEFT JOIN?",
      code: "SELECT z.zone_name\nFROM zones z\nLEFT JOIN predators p ON z.zone_id = p.zone_id\nWHERE ___________ ;",
      options: [
        { key: "A", text: "p.predator_id = 0" },
        { key: "B", text: "p.predator_id IS NULL" },
        { key: "C", text: "p.predator_id = NULL" },
        { key: "D", text: "COUNT(p.predator_id) = 0" }
      ],
      correctKey: "B",
      clue: "Safe Zone Detector: `p.predator_id IS NULL`",
      explanation: "In SQL, unmatched rows from the right table of a LEFT JOIN have NULL columns. To test for NULL, you must use `IS NULL`, not `= NULL`."
    },
    {
      id: "sql_11",
      number: 11,
      story: "You isolate the depth level of Nemo's sub-species using a subquery with the `IN` clause.",
      question: "What will this subquery query return?",
      code: "-- Table: fish (species, family_id)\n-- 'Ocellaris', 101 | 'Percula', 101 | 'Regal Tang', 102\n\nSELECT species FROM fish\nWHERE family_id IN (\n    SELECT family_id FROM fish WHERE species = 'Ocellaris'\n);",
      options: [
        { key: "A", text: "'Ocellaris' only" },
        { key: "B", text: "'Ocellaris', 'Percula'" },
        { key: "C", text: "'Regal Tang' only" },
        { key: "D", text: "All 3 species" }
      ],
      correctKey: "B",
      clue: "Clownfish Family Members: 'Ocellaris' and 'Percula'",
      explanation: "The subquery returns family_id 101. The outer query selects all fish with family_id = 101, which are 'Ocellaris' and 'Percula'."
    },
    {
      id: "sql_12",
      number: 12,
      story: "You classify ocean depth zones using a conditional `CASE WHEN` statement.",
      question: "What is the output column `zone_type` for a recorded depth of 450 meters?",
      code: "SELECT \n    CASE \n        WHEN depth < 200 THEN 'Shallow'\n        WHEN depth BETWEEN 200 AND 600 THEN 'Mesopelagic'\n        ELSE 'Bathypelagic'\n    END AS zone_type\nFROM sonar WHERE depth = 450;",
      options: [
        { key: "A", text: "\"Shallow\"" },
        { key: "B", text: "\"Mesopelagic\"" },
        { key: "C", text: "\"Bathypelagic\"" },
        { key: "D", text: "NULL" }
      ],
      correctKey: "B",
      clue: "Depth Zone Type = \"Mesopelagic\"",
      explanation: "450 falls between 200 and 600 (inclusive), so the second WHEN branch evaluates to 'Mesopelagic'."
    },
    {
      id: "sql_13",
      number: 13,
      story: "You combine two hydro-sensor feed tables: `feed_alpha` has rows `[101, 102, 103]` and `feed_beta` has rows `[102, 103, 104]`.",
      question: "How many total rows are returned by `UNION` versus `UNION ALL`?",
      code: "Query 1: SELECT id FROM feed_alpha UNION SELECT id FROM feed_beta;\nQuery 2: SELECT id FROM feed_alpha UNION ALL SELECT id FROM feed_beta;",
      options: [
        { key: "A", text: "4 rows for UNION, 6 rows for UNION ALL" },
        { key: "B", text: "6 rows for UNION, 4 rows for UNION ALL" },
        { key: "C", text: "3 rows for UNION, 6 rows for UNION ALL" },
        { key: "D", text: "4 rows for UNION, 4 rows for UNION ALL" }
      ],
      correctKey: "A",
      clue: "Union Cardinality = 4 distinct IDs (101, 102, 103, 104)",
      explanation: "UNION removes duplicates (101, 102, 103, 104 -> 4 rows). UNION ALL keeps all duplicates (3 + 3 = 6 rows)."
    },
    {
      id: "sql_14",
      number: 14,
      story: "You must extract the latest timestamp beacon for the anemone cluster using a correlated subquery or MAX().",
      question: "Which SQL query correctly returns the most recent ping timestamp for each beacon?",
      code: "Option A: SELECT beacon_id, MAX(ping_time) FROM logs GROUP BY beacon_id;\nOption B: SELECT beacon_id, ping_time FROM logs WHERE ping_time = MAX(ping_time);\nOption C: SELECT beacon_id FROM logs ORDER BY MAX(ping_time);\nOption D: SELECT beacon_id, ping_time FROM logs GROUP BY ping_time;",
      options: [
        { key: "A", text: "Option A (SELECT beacon_id, MAX(ping_time)... GROUP BY beacon_id)" },
        { key: "B", text: "Option B (using WHERE MAX...)" },
        { key: "C", text: "Option C" },
        { key: "D", text: "Option D" }
      ],
      correctKey: "A",
      clue: "Timestamp Aggregator: `MAX(ping_time) GROUP BY beacon_id`",
      explanation: "Aggregating with MAX(ping_time) and grouping by beacon_id correctly computes the latest timestamp per beacon. Using MAX in a WHERE clause directly is invalid SQL without a subquery."
    },
    {
      id: "sql_15",
      number: 15,
      story: "FINAL DATABASE DECRYPTION! You join the verified Beacon Anemone coordinates to unlock Nemo's refuge.",
      question: "What does this final query output when locating Nemo's shelter coordinates?",
      code: "-- Table: shelters\n-- shelter_id | name            | status\n-- S_101      | Coral_Cave      | Empty\n-- S_102      | Giant_Anemone   | Target_Located\n\nSELECT \n    CONCAT(name, '_SECTOR_42') AS final_location\nFROM shelters\nWHERE status = 'Target_Located';",
      options: [
        { key: "A", text: "\"Coral_Cave_SECTOR_42\"" },
        { key: "B", text: "\"Giant_Anemone_SECTOR_42\"" },
        { key: "C", text: "\"Target_Located_SECTOR_42\"" },
        { key: "D", text: "NULL" }
      ],
      correctKey: "B",
      clue: "MISSION ACCOMPLISHED: NEMO DISCOVERED AT GIANT ANEMONE SECTOR 42!",
      explanation: "Row S_102 has status 'Target_Located' and name 'Giant_Anemone'. CONCAT gives 'Giant_Anemone_SECTOR_42'. Nemo is found!"
    }
  ]
};

// Bruce's Shark Attack Bonus Questions
export const SHARK_ATTACK_QUESTIONS = [
  {
    id: "shark_1",
    title: "Bruce's Vegetarian Shark Pledge!",
    question: "Bruce roars: 'Fish are friends, not food!' In Python, what is the type of the expression `[1, 2, 3]`?",
    options: [
      { key: "A", text: "<class 'list'>" },
      { key: "B", text: "<class 'tuple'>" },
      { key: "C", text: "<class 'set'>" },
      { key: "D", text: "<class 'array'>" }
    ],
    correctKey: "A",
    explanation: "Square brackets define a Python list: `<class 'list'>`!"
  },
  {
    id: "shark_2",
    title: "Anchor & Chum Lightning Round!",
    question: "Quick! In SQL, which clause filters rows BEFORE grouping occurs?",
    options: [
      { key: "A", text: "HAVING" },
      { key: "B", text: "WHERE" },
      { key: "C", text: "ORDER BY" },
      { key: "D", text: "GROUP BY" }
    ],
    correctKey: "B",
    explanation: "WHERE filters rows before grouping; HAVING filters groups after grouping!"
  },
  {
    id: "shark_3",
    title: "Torpedo Speed Excel Trivia!",
    question: "Which Excel shortcut key combination immediately toggles between showing cell values and formulas?",
    options: [
      { key: "A", text: "Ctrl + `" },
      { key: "B", text: "Ctrl + F" },
      { key: "C", text: "Alt + F4" },
      { key: "D", text: "Ctrl + Shift + Enter" }
    ],
    correctKey: "A",
    explanation: "Ctrl + ` (grave accent) toggles formula view on/off in Excel!"
  }
];
