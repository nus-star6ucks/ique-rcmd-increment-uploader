import { NextApiRequest, NextApiResponse } from 'next'
import { runNewDataIncoming } from '../../lib/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.body.zipFilename) {
        return res.status(200).json({
            success: false,
            msg: 'Incorrect format',
        })
    }
    const { data } = await runNewDataIncoming({ incoming_dataset_zip_filename: req.body.zipFilename })
    res.status(200).json({
        success: true,
        msg: 'ok',
        data: { ...data }
    })
}
