import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/db'

const model = prisma.team
type updateType = Prisma.TeamUpdateInput

type tPrisma = typeof Prisma

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return res.json(await read(req.query.id))
        case 'PUT':
        case 'POST':
            return res.json(await update(req.query.id, req.body))
        case 'DELETE':
            return res.json(await destroy(req.query.id))
    }
}

async function read(id: string | string[]) {
    if (Array.isArray(id)) {
        return await model.findMany({ where: { id: { in: id }}})
    }

    return await model.findFirst({ where: { id }})
}

async function destroy(id: string | string[]) {
    if (Array.isArray(id)) {
        return await model.deleteMany({ where: { id: { in: id }}})
    }

    return await model.delete({ where: { id }})
}

async function update(id: string | string[], data: updateType) {
    if (Array.isArray(id)) {
        return await model.updateMany({ where: { id: { in: id }}, data })
    }

    return await model.update({ where: { id }, data })
}
