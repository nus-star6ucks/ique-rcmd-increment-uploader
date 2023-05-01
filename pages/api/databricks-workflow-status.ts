import { NextApiRequest, NextApiResponse } from 'next'
import { dbListRunsForAJob } from '../../lib/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { data } = await dbListRunsForAJob()
    res.status(200).json({
        success: true,
        isActive: (data.runs || [])?.length === 0,
    })
}
