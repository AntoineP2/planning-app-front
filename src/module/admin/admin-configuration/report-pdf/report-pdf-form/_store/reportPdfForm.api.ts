import axios from 'axios';
import { ReportDataType } from '../reportPdfForm.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;


export const getReportPresenceDataApi = async (userId: string[], datesString: string[], tokenAuth: string): Promise<ReportDataType[]> => {
    try {
        const query = `
        query GetReportPresence($userId: [String!]!, $datesString: [String!]!) {
          getReportPresence(reportInput: {
            userId: $userId,
            datesString: $datesString}){
                userId
                userName
                workTypeName
                remoteWorkDays
                onsiteWorkDays
                onsiteWorkPercentage
                parkingUsagePercentage
                totalWorkDays
                totalDays
                workDaysPercentage
                noApplyEvent
                businessDays
            }
        }
      `;

        const variables = { userId, datesString };
        const response = await axios.post(
            API_URL,
            {
                query,
                variables,
            },
            {
                headers: {
                    'secret-api': API_KEY,
                    Authorization: `Bearer ${tokenAuth}`,
                },
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getReportPresence;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};