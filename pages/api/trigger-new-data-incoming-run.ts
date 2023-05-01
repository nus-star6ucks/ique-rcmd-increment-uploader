import { NextApiRequest, NextApiResponse } from 'next'
import { runNewDataIncoming } from '../../lib/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.query.zipFilename) {
        return res.status(200).json({
            success: false
        })
    }
    const { data } = await runNewDataIncoming({ incoming_dataset_zip_filename: req.query.zipFilename })
    res.status(200).json({
        success: true,
        data: { ...data }
    })
}
