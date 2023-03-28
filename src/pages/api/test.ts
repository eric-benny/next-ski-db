import type { NextApiRequest, NextApiResponse } from "next";

export const test = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json('test endpoint');
};

export default test;
