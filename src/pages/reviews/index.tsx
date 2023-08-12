import { NextPage } from "next";
import {
  RatingMap,
  Review,
  reviewsArray,
  Rating,
  LengthMap,
  MetricMap,
  Gender,
  Ability,
  ABILITY,
} from "../../lib/data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Navbar } from "~/components/navbar";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Slider } from "~/components/ui/slider";
import { useDebounce } from "use-debounce";
import { Button } from "~/components/ui/button";

function inchesToHeightString(inches: number) {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;

  return `${feet}' ${remainingInches}"`;
}

function calculateAverageRatings(reviews: Review[]) {
  let totalManeuverability = 0;
  let totalStability = 0;
  let totalForgiving = 0;
  let totalSuspension = 0;
  let totalFun = 0;
  let totalLength = 0;

  for (const review of reviews) {
    totalManeuverability += review.maneuverability;
    totalStability += review.stability;
    totalForgiving += review.forgiving;
    totalSuspension += review.suspension;
    totalFun += review.fun;
    totalLength += review.length;
  }

  const numberOfReviews = reviews.length;

  if (numberOfReviews > 0) {
    return {
      averageManeuverability: (
        totalManeuverability / numberOfReviews
      ).toPrecision(2),
      averageStability: (totalStability / numberOfReviews).toPrecision(2),
      averageForgiving: (totalForgiving / numberOfReviews).toPrecision(2),
      averageSuspension: (totalSuspension / numberOfReviews).toPrecision(2),
      averageFun: (totalFun / numberOfReviews).toPrecision(2),
      averageLength: (totalLength / numberOfReviews).toPrecision(2),
    };
  } else {
    return {
      averageManeuverability: 1,
      averageStability: 1,
      averageForgiving: 1,
      averageSuspension: 1,
      averageFun: 1,
      averageLength: 1,
    };
  }
}
type Range = { label: string; upper: number; lower: number };
type ReviewerFilterAttributes = {
  height?: [number, number];
  weight?: [number, number];
  age?: Range[];
  ability?: Ability[];
  gender?: Gender;
};

function filterReviewsByReviewerAttributes(
  reviews: Review[],
  filter: ReviewerFilterAttributes
): Review[] {
  return reviews.filter((review) => {
    const reviewer = review.reviewer;
    const genderFilter = filter["gender"];
    if (
      genderFilter &&
      genderFilter !== "ALL" &&
      genderFilter !== reviewer.gender
    ) {
      return false;
    }
    const abilityFilter = filter["ability"];
    if (abilityFilter && !abilityFilter.includes(review.reviewer.ability)) {
      return false;
    }
    const ageFilter = filter["age"];
    if (ageFilter) {
      const minMax = ageFilter.reduce(
        (acc, age) => {
          if (age.lower < acc.min) acc.min = age.lower;
          if (age.upper > acc.max) acc.max = age.upper;
          return acc;
        },
        { min: 150, max: 0 }
      );

      if (reviewer.age < minMax.min || minMax.max < reviewer.age) {
        return false;
      }
    }
    const heightFilter = filter["height"];
    if (heightFilter) {
      if (
        reviewer.height < heightFilter[0] ||
        heightFilter[1] < reviewer.height
      ) {
        return false;
      }
    }
    const weightFilter = filter["weight"];
    if (weightFilter) {
      if (
        reviewer.weight < weightFilter[0] ||
        weightFilter[1] < reviewer.weight
      ) {
        return false;
      }
    }
    return true;
  });
}

const Reviews: NextPage = () => {
  const allAverage = calculateAverageRatings(reviewsArray);

  const [filteredArray, setFilteredArray] = useState(reviewsArray);
  // Filters
  const [gender, setGender] = useState<Gender>("ALL");
  const abilityFilterDefault: Ability[] = [
    "beginner",
    "intermediate",
    "advanced",
    "expert",
  ];
  const [abilityFilter, setAbilityFilter] = useState(abilityFilterDefault);

  const ageFilterDefault: Range[] = [
    { label: "< 20", upper: 19, lower: 0 },
    { label: "20s", upper: 29, lower: 20 },
    { label: "30s", upper: 39, lower: 30 },
    { label: "40s", upper: 49, lower: 40 },
    { label: "50s", upper: 59, lower: 50 },
    { label: "60s", upper: 69, lower: 60 },
    { label: "70+", upper: 150, lower: 70 },
  ];
  const [ageFilter, setAgeFilter] = useState(ageFilterDefault);
  const heightRange: [number, number] = [48, 84];
  const [heightFilter, setHeightFilter] = useState(heightRange);
  const [debouncedHeightFilter] = useDebounce(heightFilter, 500);

  const weightRange: [number, number] = [80, 300];
  const [weightFilter, setWeightFilter] = useState(weightRange);
  const [debouncedWeightFilter] = useDebounce(weightFilter, 500);

  const resetFilters = () => {
    setGender("ALL");
    setAbilityFilter(abilityFilterDefault);
    setAgeFilter(ageFilterDefault);
    setHeightFilter(heightRange);
    setWeightFilter(weightRange);
  };

  const applyProfile = () => {
    setGender(myFilters.gender ?? "ALL");
    setAbilityFilter(myFilters.ability ?? abilityFilterDefault);
    setAgeFilter(myFilters.age ?? ageFilterDefault);
    setHeightFilter(myFilters.height ?? heightRange);
    setWeightFilter(myFilters.weight ?? weightRange);
  };

  const myFilters: ReviewerFilterAttributes = {
    height: [67, 72],
    weight: [165, 180],
    age: [
      { label: "20s", upper: 29, lower: 20 },
      { label: "30s", upper: 39, lower: 30 },
    ],
    ability: ["advanced", "expert"],
    gender: "M",
  };

  useEffect(() => {
    // console.log('do filters');
    if (abilityFilter.length === 0) {
      setAbilityFilter(abilityFilterDefault);
      return;
    }
    if (ageFilter.length === 0) {
      setAgeFilter(ageFilterDefault);
      return;
    }
    const filters = {
      height: debouncedHeightFilter,
      weight: debouncedWeightFilter,
      age: ageFilter,
      ability: abilityFilter,
      gender: gender,
    };
    const filtered = filterReviewsByReviewerAttributes(reviewsArray, filters);
    setFilteredArray(filtered);
  }, [
    gender,
    abilityFilter,
    ageFilter,
    debouncedHeightFilter,
    debouncedWeightFilter,
  ]);
  const filterAverage = calculateAverageRatings(filteredArray);

  const data = [
    {
      name: "maneuverability",
      totalAverage: allAverage.averageManeuverability,
      filterAverage: filterAverage.averageManeuverability,
      placeholder: 0,
    },
    {
      name: "stability",
      totalAverage: allAverage.averageStability,
      filterAverage: filterAverage.averageStability,
    },
    {
      name: "forgiving",
      totalAverage: allAverage.averageForgiving,
      filterAverage: filterAverage.averageForgiving,
    },
    {
      name: "suspension",
      totalAverage: allAverage.averageSuspension,
      filterAverage: filterAverage.averageSuspension,
    },
    {
      name: "fun",
      totalAverage: allAverage.averageFun,
      filterAverage: filterAverage.averageFun,
    },
    {
      name: "length",
      totalAverage: allAverage.averageLength,
      filterAverage: filterAverage.averageLength,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="mb-2 flex flex-col items-center">
        <text className="text-4xl font-medium">Reviews</text>
        <span className="text-sm font-light italic">
          * Sample data for display purposes
        </span>
      </div>
      <div className="flex flex-auto justify-center">
        <div className="flex w-3/5 min-w-fit flex-col space-y-2 rounded-md border border-border p-3">
          <div className="flex justify-between">
            <div className="flex ">Filters</div>
            <div className="flex gap-2">
              <Button size="sm" onClick={applyProfile}>
                Apply Profile
              </Button>
              <Button size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
          <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
          <div className="flex justify-center space-x-10">
            <div className="flex h-fit flex-col items-start space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                onValueChange={(value: Gender) => setGender(value)}
                value={gender}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ALL" id="ALL" />
                  <Label className="font-normal">ALL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="M" />
                  <Label className="font-normal">M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="F" />
                  <Label className="font-normal">F</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex h-fit flex-col items-start space-y-2">
              <Label>Ability</Label>
              {ABILITY.map((ability) => (
                <div
                  key={ability}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <Checkbox
                    checked={abilityFilter.includes(ability)}
                    onCheckedChange={(checked) => {
                      const currentFilters = abilityFilter;
                      return checked
                        ? setAbilityFilter([...currentFilters, ability])
                        : setAbilityFilter(
                            currentFilters.filter((value) => value !== ability)
                          );
                    }}
                  />
                  <Label className="font-normal">{ability}</Label>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-28 items-start space-y-2">
              <Label>Age</Label>
              <div className="flex h-24 flex-col flex-wrap gap-2">
                {ageFilterDefault.map((age) => (
                  <div
                    key={age.label}
                    className="flex flex-row items-start space-x-2"
                  >
                    <Checkbox
                      checked={ageFilter.some((a) => a.label === age.label)}
                      onCheckedChange={(checked) => {
                        const currentFilters = ageFilter;
                        return checked
                          ? setAgeFilter([...currentFilters, age])
                          : setAgeFilter(
                              currentFilters.filter(
                                (value) => value.label !== age.label
                              )
                            );
                      }}
                    />
                    <Label className="font-normal">{age.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-around">
            <div className="flex w-2/5 flex-col space-y-2">
              <div>
                <Label className="mr-3">Height</Label>
                <Label className="font-normal">{`${inchesToHeightString(
                  heightFilter[0]
                )} - ${inchesToHeightString(heightFilter[1])}`}</Label>
              </div>
              <Slider
                value={heightFilter as number[]}
                onValueChange={(value) =>
                  setHeightFilter(value as [number, number])
                }
                min={heightRange[0]}
                max={heightRange[1]}
                step={1}
                minStepsBetweenThumbs={4}
              />
            </div>
            <div className="flex w-2/5 flex-col space-y-2">
              <div>
                <Label className="mr-3">Weight</Label>
                <Label className="font-normal">{`${weightFilter[0]} - ${weightFilter[1]}`}</Label>
              </div>
              <Slider
                value={weightFilter as number[]}
                onValueChange={(value) =>
                  setWeightFilter(value as [number, number])
                }
                min={weightRange[0]}
                max={weightRange[1]}
                step={1}
                minStepsBetweenThumbs={4}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        {filteredArray.length === 0 ? (
          <span className="text-red-500">* No reviews match given filters</span>
        ) : (
          <div className="p-3"></div>
        )}
      </div>
      <div className="flex justify-center">
        <ResponsiveContainer
          minWidth={"400px"}
          width={"65%"}
          height={40 * data.length}
          debounce={50}

        >
          <BarChart data={data.slice(0, 5)} layout="vertical">
            <XAxis
              xAxisId={0}
              dataKey="totalAverage"
              type="number"
              stroke="#52525b"
              fontSize={12}
              domain={[1, 5]}
              tickFormatter={(value: Rating) => RatingMap[value]}
              tickLine={true}
              axisLine={true}
            />
            <YAxis
              orientation="left"
              yAxisId={0}
              stroke="#52525b"
              fontSize={12}
              dataKey="name"
              type="category"
              tickFormatter={(value: keyof typeof MetricMap) =>
                MetricMap[value]
              }
              tickLine={false}
              axisLine={false}
              width={150}
            />
            <Bar
              dataKey="totalAverage"
              fill="#71717a"
              radius={[0, 4, 4, 0]}
              minPointSize={2}
              barSize={20}
              label={{ position: "right", fontSize: 12 }}
            />
            <Bar
              dataKey="filterAverage"
              fill={filteredArray.length > 0 ? "#ef4444" : "white"}
              radius={[0, 4, 4, 0]}
              minPointSize={2}
              barSize={20}
              label={
                filteredArray.length > 0
                  ? { position: "right", fontSize: 12 }
                  : { position: "right", fontSize: 1 }
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center">
        <ResponsiveContainer width={"65%"} height={104} debounce={50}>
          <BarChart data={[data[5]]} layout="vertical">
            <XAxis
              xAxisId={0}
              dataKey="totalAverage"
              type="number"
              stroke="#52525b"
              fontSize={12}
              domain={[1, 5]}
              tickFormatter={(value: Rating) => LengthMap[value]}
              tickLine={true}
              axisLine={true}
            />
            <YAxis
              orientation="left"
              yAxisId={0}
              stroke="#52525b"
              fontSize={12}
              dataKey="name"
              type="category"
              tickFormatter={() => "Length"}
              tickLine={false}
              axisLine={false}
              width={150}
            />
            <Legend />
            <Bar
              dataKey="totalAverage"
              fill="#71717a"
              radius={[0, 4, 4, 0]}
              minPointSize={2}
              barSize={20}
              label={{ position: "right", fontSize: 12 }}
            />
            <Bar
              dataKey="filterAverage"
              fill={filteredArray.length > 0 ? "#ef4444" : "white"}
              radius={[0, 4, 4, 0]}
              minPointSize={2}
              barSize={20}
              label={
                filteredArray.length > 0
                  ? { position: "right", fontSize: 12 }
                  : { position: "right", fontSize: 1 }
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Reviews;
