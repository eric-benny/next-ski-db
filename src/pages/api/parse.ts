import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log("body", req.body);
  const ski = getSkiObj(req.body.text);
  res.status(200).json(ski);
}

function getSkiObj(text: string) {
  let currYear;

  // Parse year from title
  // const yearRe = /[0-9]{4}/g;
  // try {
  //     const strArrayTitle = details.title.match(yearRe);
  //     const strArray = strArrayTitle ? strArrayTitle : details.url.match(yearRe);
  //     const numArray = strArray.map(year => parseInt(year))
  //     currYear = Math.max(...numArray)
  // } catch { }

  let yearsActive;
  let yearReleased;
  let revLength;
  let model;
  let manufacturer;
  let lengths;
  let measLength;
  let weightStated;
  let weightsMeas;
  let dimTip;
  let dimWaist;
  let dimTail;
  let dimTipMeas;
  let dimWaistMeas;
  let dimTailMeas;
  let sidcutStated;
  let splayTip;
  let splayTail;
  let camber;
  let core;
  let mountPointsFac;
  let mountPointsBlist;
  let flexTip;
  let flexShovel;
  let flexFront;
  let flexFoot;
  let flexBack;
  let flexTail;
  let base;

  const specArray = text.split("\n");

  // loop through specs
  for (let i = 0; i < specArray.length; i++) {
    // @ts-ignore
    const split = specArray[i].split(":");
    if (split.length === 2) {
      // @ts-ignore
      const label = split[0].trim();

      // @ts-ignore
      const value = split[1].trim();

      if (label === "Ski") {
        const yearRangeRe = /[0-9]{4}-[0-9]{4}/g;

        // @ts-ignore
        const yearRange = value.match(yearRangeRe)[0];

        // @ts-ignore
        const years = yearRange.split("-");

        // @ts-ignore
        currYear = parseInt(years[1]);
        const modelLength = value.replace(yearRangeRe, "").trim();

        // @ts-ignore
        const manModel = modelLength.split(",")[0].trim();
        if (
          modelLength.substring(0, 2) === "J " ||
          modelLength.substring(0, 4) === "WNDR " ||
          modelLength.substring(0, 12) === "Black Crows"
        ) {
          manufacturer = manModel
            .split(" ")
            .slice(0, 2)
            .reduce((prev, str) => prev.concat(" ", str));
          model = manModel
            .split(" ")
            .slice(2)
            // @ts-ignore
            .reduce((prev, str) => prev.concat([" ", str]));
        } else {
          manufacturer = manModel.split(" ")[0];
          if (manufacturer === "LINE") {
            manufacturer = "Line";
          }
          model = manModel
            .split(" ")
            .slice(1)
            .reduce((prev, str) => prev.concat(" ", str));
        }
        const reLength = /[0-9]{3}/g;
        revLength = parseInt(
          // @ts-ignore
          modelLength.split(",")[1].trim().match(reLength)[0].trim()
        );
      } else if (label === "Available Lengths") {
        const lengthsStrWhole = value.replace("cm", "").trim();
        const lengthsStr = lengthsStrWhole.split(",");
        if (manufacturer === "Black Crows") {
          lengths = lengthsStr.map((lengthStr) => parseFloat(lengthStr));
        } else {
          lengths = lengthsStr.map((lengthStr) => parseInt(lengthStr));
        }
      } else if (label.includes("Measured Tip-to-Tail Length")) {
        measLength = parseFloat(value.replace("cm", "").trim());
      } else if (label.includes("Stated Weight per Ski")) {
        const weightRe = /[0-9]{4}/g;
        // @ts-ignore
        weightStated = parseInt(value.match(weightRe)[0]);
      } else if (label.includes("Measured Weight per Ski")) {
        const weightRe = /[0-9]{4}/g;
        // @ts-ignore
        weightsMeas = value
          // @ts-ignore
          .replace(",", "")
          .match(weightRe)
          .map((w) => parseInt(w));
      } else if (label.includes("Stated Dimensions")) {
        const dimRe = /[0-9]{2,3}\.?[0-9]?/g;
        try {
          // @ts-ignore
          const dims = value.match(dimRe).map((dim) => parseFloat(dim));
          dimTip = dims[0];
          dimWaist = dims[1];
          dimTail = dims[2];
        } catch {}
      } else if (label.includes("Measured Dimensions")) {
        const dimRe = /[0-9]{2,3}\.?[0-9]?/g;
        // @ts-ignore
        const dims = value.match(dimRe).map((dim) => parseFloat(dim));
        dimTipMeas = dims[0];
        dimWaistMeas = dims[1];
        dimTailMeas = dims[2];
      } else if (label.includes("Stated Sidecut")) {
        const radiusRe = /[0-9]{2}/g;
        try {
          // @ts-ignore
          const dims = value.match(radiusRe).map((dim) => parseFloat(dim));
          sidcutStated = dims[0];
        } catch {}
      } else if (label.includes("Splay")) {
        const splayRe = /[0-9]{2,3}\.?[0-9]?/g;
        // @ts-ignore
        const dims = value.match(splayRe).map((dim) => parseFloat(dim));
        splayTip = dims[0];
        splayTail = dims[1];
      } else if (label.includes("Camber Underfoot")) {
        const camberRe = /[0-9]{1,3}\.?[0-9]?/g;
        // @ts-ignore
        camber = parseFloat(value.match(camberRe)[0]);
      } else if (label.includes("Core")) {
        core = value.replace(";", "").trim();
      } else if (label.includes("Base")) {
        base = value.replace(";", "").trim();
      } else if (label === "Factory Recommended Mount Point") {
        mountPointsFac = value.split("@").map((mp) => mp.trim());
      } else if (label === "Blister's Recommended Mount Point") {
        mountPointsBlist = value.split("@").map((mp) => mp.trim());
      } else if (label.includes("Note") && label.includes("[")) {
        const yearRe = /[0-9]{2}\/[0-9]{2}/g;
        // @ts-ignore
        const years = value
          .match(yearRe)
          .map((yearStr) => yearStr.split("/")[1])
          // @ts-ignore
          .sort((a, b) => a - b);
        // @ts-ignore
        yearReleased = parseInt("20".concat(years[0]));
        // @ts-ignore
        yearsActive = years.map((year) => parseInt("20".concat(year)));
      } else if (label.includes("Tip")) {
        flexTip = value;
      } else if (label.includes("Shovel")) {
        flexShovel = value;
      } else if (label.includes("Front")) {
        flexFront = value;
      } else if (label.includes("Under")) {
        flexFoot = value;
      } else if (label.includes("Behind")) {
        flexBack = value;
      } else if (label.includes("Tail")) {
        flexTail = value;
      }
    } else {
      // do nothing
    }
  }

  yearReleased = yearReleased ? yearReleased : currYear;

  const ski = {
    yearCurrent: currYear,
    yearReleased: yearReleased,
    yearsActive: yearsActive,
    retired: false,
    manufacturer: manufacturer?.replace("’", "'"), //manufacturers.get(manufacturer), //String,
    model: model,
    lengths: lengths,
    specs: [
      {
        length: revLength,
        measuredLength: measLength ? measLength : 0,
        weightStated: weightStated,
        weightMeas: weightsMeas,
        dimTip: dimTip ? dimTip : 0, // Number
        dimWaist: dimWaist ? dimWaist : 0, // Number,
        dimTail: dimTail ? dimTail : 0, // Number,
        dimTipMeas: dimTipMeas ? dimTipMeas : 0, // Number,
        dimWaistMeas: dimWaistMeas ? dimWaistMeas : 0, // Number,
        dimTailMeas: dimTailMeas ? dimTailMeas : 0, // Number,
        sidcutStated: sidcutStated, // Number,
        splayTip: splayTip, // Number,
        splayTail: splayTail, // Number,
        camberStated: null, // String,
        camberMeas: camber, // String,
        core: core, // String,
        base: base,
        mountPointFac: mountPointsFac, // [String],
        mountPointBlist: mountPointsBlist, // [String],
        flexTip: flexTip, // Number,
        flexShovel: flexShovel, // Number,
        flexFront: flexFront, // Number,
        flexFoot: flexFoot, // Number,
        flexBack: flexBack, // Number,
        flexTail: flexTail, // Number,
      },
    ],
    skiComps: [],
    guideInfo: [],
    notes: [],
    images: [],
    url: "",
  };
  return ski;
}
