import { NextApiRequest, NextApiResponse } from 'next'
import { dbListRunsForAJob } from '../../lib/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { data } = await dbListRunsForAJob()
    const jobs = Array.isArray(data.jobs) ? data.jobs as Array<any> : []
    res.status(200).json({
        data: jobs,
        success: true,
        isActive: jobs.length === 0,
    })
}
