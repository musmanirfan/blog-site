import { Timestamp } from 'firebase/firestore';

export function formatDate(data: { createdDate: Timestamp }) {
    const timestamp = data?.createdDate;

    if (!timestamp) {
        return 'No Date Available';
    }

    const date = timestamp.toDate();

    const pad = (num: number) => num.toString().padStart(2, '0');
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const secondsTime = pad(date.getUTCSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}:${secondsTime}.${milliseconds}`;
    return formattedDate;
}