import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";

export const skis = async (req: NextApiRequest, res: NextApiResponse) => {
  const skis = await prisma.ski.findMany();
  res.status(200).json(skis);
};

export default skis;
