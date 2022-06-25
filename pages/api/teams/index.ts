import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/db'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            return res.json(await create(req.body))
        case 'GET':
            return res.json(await index())
    }
}

async function index() {
    const x = await prisma.team.findMany()
    console.log(x)
    return x
}

async function create(data: Prisma.TeamCreateInput) {
    return await prisma.team.create({ data })
}
