export type Rating = 1 | 2 | 3 | 4 | 5;

export const ABILITY = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
export type Ability = typeof ABILITY[number];

export type Gender = "M" | "F" | "ALL";

export const MetricMap = {
  maneuverability: "Maneuverability",
  stability: "Stability",
  forgiving: "Forgiving",
  suspension: "Suspension",
  fun: "Fun Factor",
  length: "Length",
};

export const RatingMap = {
  1: "Terrible",
  2: "Not very good",
  3: "Average / Okay",
  4: "Pretty good",
  5: "Excellent",
};

export const LengthMap = {
  5: "Way too long",
  4: "A bit too long",
  3: "Just right",
  2: "A bit too short",
  1: "Way too short",
};

type Reviewer = {
  id: string;
  height: number;
  weight: number;
  age: number;
  ability: Ability;
  gender: Gender;
};

export type Review = {
  id: string;
  reviewer: Reviewer;
  maneuverability: Rating;
  stability: Rating;
  forgiving: Rating;
  suspension: Rating;
  fun: Rating;
  length: Rating;
};

export const reviewsArray: Review[] = [
  {
    id: "001",
    reviewer: {
      id: "456",
      height: 72,
      weight: 150,
      age: 35,
      ability: "expert",
      gender: "F",
    },
    maneuverability: 5,
    stability: 4,
    forgiving: 3,
    suspension: 5,
    fun: 4,
    length: 3,
  },
  {
    id: "002",
    reviewer: {
      id: "789",
      height: 66,
      weight: 180,
      age: 40,
      ability: "beginner",
      gender: "M",
    },
    maneuverability: 2,
    stability: 2,
    forgiving: 3,
    suspension: 1,
    fun: 2,
    length: 2,
  },
  {
    id: "003",
    reviewer: {
      id: "321",
      height: 64,
      weight: 140,
      age: 23,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 4,
    stability: 3,
    forgiving: 4,
    suspension: 3,
    fun: 4,
    length: 3,
  },
  {
    id: "004",
    reviewer: {
      id: "654",
      height: 68,
      weight: 165,
      age: 27,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 5,
    stability: 4,
    forgiving: 4,
    suspension: 5,
    fun: 5,
    length: 4,
  },
  {
    id: "005",
    reviewer: {
      id: "987",
      height: 70,
      weight: 160,
      age: 32,
      ability: "expert",
      gender: "F",
    },
    maneuverability: 5,
    stability: 5,
    forgiving: 5,
    suspension: 5,
    fun: 5,
    length: 5,
  },
  {
    id: "006",
    reviewer: {
      id: "741",
      height: 63,
      weight: 130,
      age: 21,
      ability: "beginner",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 4,
    suspension: 2,
    fun: 3,
    length: 2,
  },
  {
    id: "007",
    reviewer: {
      id: "852",
      height: 74,
      weight: 190,
      age: 36,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 4,
    stability: 4,
    forgiving: 5,
    suspension: 4,
    fun: 4,
    length: 4,
  },
  {
    id: "008",
    reviewer: {
      id: "963",
      height: 65,
      weight: 155,
      age: 25,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 3,
    suspension: 3,
    fun: 3,
    length: 3,
  },
  {
    id: "009",
    reviewer: {
      id: "102",
      height: 67,
      weight: 175,
      age: 30,
      ability: "expert",
      gender: "M",
    },
    maneuverability: 5,
    stability: 4,
    forgiving: 5,
    suspension: 4,
    fun: 4,
    length: 4,
  },
  {
    id: "010",
    reviewer: {
      id: "300",
      height: 71,
      weight: 185,
      age: 26,
      ability: "beginner",
      gender: "M",
    },
    maneuverability: 2,
    stability: 3,
    forgiving: 3,
    suspension: 2,
    fun: 3,
    length: 3,
  },
  {
    id: "011",
    reviewer: {
      id: "301",
      height: 62,
      weight: 120,
      age: 22,
      ability: "beginner",
      gender: "F",
    },
    maneuverability: 3,
    stability: 2,
    forgiving: 2,
    suspension: 2,
    fun: 3,
    length: 2,
  },
  {
    id: "012",
    reviewer: {
      id: "302",
      height: 76,
      weight: 210,
      age: 34,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 4,
    stability: 4,
    forgiving: 5,
    suspension: 5,
    fun: 4,
    length: 4,
  },
  {
    id: "013",
    reviewer: {
      id: "303",
      height: 60,
      weight: 130,
      age: 18,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 3,
    suspension: 3,
    fun: 3,
    length: 3,
  },
  {
    id: "014",
    reviewer: {
      id: "304",
      height: 73,
      weight: 160,
      age: 28,
      ability: "expert",
      gender: "M",
    },
    maneuverability: 5,
    stability: 5,
    forgiving: 5,
    suspension: 5,
    fun: 5,
    length: 5,
  },
  {
    id: "015",
    reviewer: {
      id: "305",
      height: 68,
      weight: 145,
      age: 25,
      ability: "beginner",
      gender: "F",
    },
    maneuverability: 2,
    stability: 2,
    forgiving: 3,
    suspension: 1,
    fun: 2,
    length: 2,
  },
  {
    id: "016",
    reviewer: {
      id: "306",
      height: 69,
      weight: 172,
      age: 31,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 4,
    stability: 4,
    forgiving: 4,
    suspension: 4,
    fun: 4,
    length: 4,
  },
  {
    id: "017",
    reviewer: {
      id: "307",
      height: 64,
      weight: 150,
      age: 20,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 3,
    suspension: 2,
    fun: 3,
    length: 2,
  },
  {
    id: "018",
    reviewer: {
      id: "308",
      height: 71,
      weight: 190,
      age: 33,
      ability: "expert",
      gender: "M",
    },
    maneuverability: 5,
    stability: 5,
    forgiving: 5,
    suspension: 4,
    fun: 5,
    length: 5,
  },
  {
    id: "019",
    reviewer: {
      id: "309",
      height: 66,
      weight: 140,
      age: 24,
      ability: "beginner",
      gender: "F",
    },
    maneuverability: 2,
    stability: 2,
    forgiving: 2,
    suspension: 1,
    fun: 2,
    length: 1,
  },
  {
    id: "020",
    reviewer: {
      id: "310",
      height: 74,
      weight: 180,
      age: 36,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 4,
    stability: 4,
    forgiving: 4,
    suspension: 4,
    fun: 4,
    length: 4,
  },
  {
    id: "021",
    reviewer: {
      id: "311",
      height: 65,
      weight: 155,
      age: 19,
      ability: "beginner",
      gender: "M",
    },
    maneuverability: 2,
    stability: 1,
    forgiving: 2,
    suspension: 2,
    fun: 2,
    length: 1,
  },
  {
    id: "022",
    reviewer: {
      id: "312",
      height: 70,
      weight: 165,
      age: 27,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 4,
    suspension: 3,
    fun: 4,
    length: 3,
  },
  {
    id: "023",
    reviewer: {
      id: "313",
      height: 63,
      weight: 135,
      age: 22,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 4,
    stability: 4,
    forgiving: 4,
    suspension: 4,
    fun: 4,
    length: 4,
  },
  {
    id: "024",
    reviewer: {
      id: "314",
      height: 72,
      weight: 200,
      age: 35,
      ability: "expert",
      gender: "F",
    },
    maneuverability: 5,
    stability: 5,
    forgiving: 5,
    suspension: 5,
    fun: 5,
    length: 5,
  },
  {
    id: "025",
    reviewer: {
      id: "315",
      height: 68,
      weight: 145,
      age: 29,
      ability: "beginner",
      gender: "M",
    },
    maneuverability: 2,
    stability: 2,
    forgiving: 3,
    suspension: 2,
    fun: 3,
    length: 2,
  },
  {
    id: "026",
    reviewer: {
      id: "316",
      height: 66,
      weight: 170,
      age: 31,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 3,
    suspension: 3,
    fun: 3,
    length: 3,
  },
  {
    id: "027",
    reviewer: {
      id: "317",
      height: 74,
      weight: 185,
      age: 40,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 4,
    stability: 4,
    forgiving: 5,
    suspension: 4,
    fun: 5,
    length: 4,
  },
  {
    id: "028",
    reviewer: {
      id: "318",
      height: 62,
      weight: 125,
      age: 23,
      ability: "expert",
      gender: "F",
    },
    maneuverability: 5,
    stability: 4,
    forgiving: 5,
    suspension: 5,
    fun: 5,
    length: 4,
  },
  {
    id: "029",
    reviewer: {
      id: "319",
      height: 69,
      weight: 160,
      age: 30,
      ability: "beginner",
      gender: "M",
    },
    maneuverability: 2,
    stability: 3,
    forgiving: 3,
    suspension: 2,
    fun: 2,
    length: 3,
  },
  {
    id: "030",
    reviewer: {
      id: "320",
      height: 67,
      weight: 150,
      age: 26,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 4,
    suspension: 3,
    fun: 4,
    length: 3,
  },
  {
    id: "031",
    reviewer: {
      id: "401",
      height: 66,
      weight: 160,
      age: 55,
      ability: "expert",
      gender: "M",
    },
    maneuverability: 4,
    stability: 3,
    forgiving: 3,
    suspension: 4,
    fun: 4,
    length: 3,
  },
  {
    id: "032",
    reviewer: {
      id: "402",
      height: 63,
      weight: 150,
      age: 57,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 4,
    suspension: 2,
    fun: 3,
    length: 3,
  },
  {
    id: "033",
    reviewer: {
      id: "403",
      height: 70,
      weight: 170,
      age: 60,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 4,
    stability: 5,
    forgiving: 4,
    suspension: 3,
    fun: 4,
    length: 4,
  },
  {
    id: "034",
    reviewer: {
      id: "404",
      height: 65,
      weight: 155,
      age: 65,
      ability: "beginner",
      gender: "F",
    },
    maneuverability: 2,
    stability: 2,
    forgiving: 3,
    suspension: 1,
    fun: 2,
    length: 2,
  },
  {
    id: "035",
    reviewer: {
      id: "405",
      height: 68,
      weight: 165,
      age: 59,
      ability: "expert",
      gender: "M",
    },
    maneuverability: 5,
    stability: 5,
    forgiving: 4,
    suspension: 5,
    fun: 5,
    length: 5,
  },
  {
    id: "036",
    reviewer: {
      id: "406",
      height: 64,
      weight: 160,
      age: 73,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 3,
    suspension: 2,
    fun: 3,
    length: 3,
  },
  {
    id: "037",
    reviewer: {
      id: "407",
      height: 71,
      weight: 175,
      age: 56,
      ability: "advanced",
      gender: "M",
    },
    maneuverability: 5,
    stability: 4,
    forgiving: 5,
    suspension: 4,
    fun: 4,
    length: 4,
  },
  {
    id: "038",
    reviewer: {
      id: "408",
      height: 62,
      weight: 150,
      age: 68,
      ability: "beginner",
      gender: "F",
    },
    maneuverability: 2,
    stability: 3,
    forgiving: 3,
    suspension: 2,
    fun: 2,
    length: 2,
  },
  {
    id: "039",
    reviewer: {
      id: "409",
      height: 67,
      weight: 160,
      age: 74,
      ability: "expert",
      gender: "M",
    },
    maneuverability: 5,
    stability: 5,
    forgiving: 5,
    suspension: 5,
    fun: 5,
    length: 5,
  },
  {
    id: "040",
    reviewer: {
      id: "410",
      height: 63,
      weight: 140,
      age: 53,
      ability: "intermediate",
      gender: "F",
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 3,
    suspension: 3,
    fun: 3,
    length: 3,
  },
  {
    id: "050",
    reviewer: {
      id: "350",
      height: 48,
      weight: 85,
      age: 22,
      ability: "beginner",
      gender: "F"
    },
    maneuverability: 2,
    stability: 2,
    forgiving: 2,
    suspension: 1,
    fun: 2,
    length: 1
  },
  {
    id: "051",
    reviewer: {
      id: "351",
      height: 76,
      weight: 230,
      age: 45,
      ability: "expert",
      gender: "F"
    },
    maneuverability: 4,
    stability: 5,
    forgiving: 5,
    suspension: 4,
    fun: 4,
    length: 5
  },
  {
    id: "052",
    reviewer: {
      id: "352",
      height: 49,
      weight: 110,
      age: 19,
      ability: "intermediate",
      gender: "F"
    },
    maneuverability: 3,
    stability: 2,
    forgiving: 3,
    suspension: 2,
    fun: 2,
    length: 2
  },
  {
    id: "053",
    reviewer: {
      id: "353",
      height: 80,
      weight: 260,
      age: 50,
      ability: "advanced",
      gender: "M"
    },
    maneuverability: 5,
    stability: 4,
    forgiving: 5,
    suspension: 5,
    fun: 5,
    length: 4
  },
  {
    id: "054",
    reviewer: {
      id: "354",
      height: 50,
      weight: 95,
      age: 23,
      ability: "beginner",
      gender: "M"
    },
    maneuverability: 3,
    stability: 2,
    forgiving: 3,
    suspension: 2,
    fun: 3,
    length: 2
  },
  {
    id: "055",
    reviewer: {
      id: "355",
      height: 81,
      weight: 240,
      age: 48,
      ability: "expert",
      gender: "M"
    },
    maneuverability: 4,
    stability: 4,
    forgiving: 4,
    suspension: 4,
    fun: 4,
    length: 5
  },
  {
    id: "056",
    reviewer: {
      id: "356",
      height: 49,
      weight: 105,
      age: 20,
      ability: "intermediate",
      gender: "M"
    },
    maneuverability: 3,
    stability: 3,
    forgiving: 2,
    suspension: 3,
    fun: 3,
    length: 3
  },
  {
    id: "057",
    reviewer: {
      id: "357",
      height: 83,
      weight: 270,
      age: 46,
      ability: "advanced",
      gender: "M"
    },
    maneuverability: 4,
    stability: 5,
    forgiving: 4,
    suspension: 5,
    fun: 4,
    length: 4
  },
  {
    id: "058",
    reviewer: {
      id: "358",
      height: 48,
      weight: 100,
      age: 21,
      ability: "beginner",
      gender: "F"
    },
    maneuverability: 3,
    stability: 2,
    forgiving: 2,
    suspension: 2,
    fun: 2,
    length: 2
  },
  {
    id: "059",
    reviewer: {
      id: "359",
      height: 82,
      weight: 290,
      age: 49,
      ability: "expert",
      gender: "M"
    },
    maneuverability: 5,
    stability: 5,
    forgiving: 5,
    suspension: 4,
    fun: 5,
    length: 4
  }
];
