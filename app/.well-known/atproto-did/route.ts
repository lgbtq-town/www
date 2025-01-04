import { NextRequest } from 'next/server';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { Amplify } from 'aws-amplify';
import outputs from '../../../amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export async function GET(request: NextRequest) {
    const hostname = request.headers.get('host')!;
    const segments = hostname.split('.');
    const username = segments.length === 3 ? segments[0] : '';

    console.log(`Hostname: ${hostname}`);
    console.log(`Username: ${username}`);

    let did;
    if (username) {
        const { data: user, errors } = await client.models.User.get({
            username,
        });
        did = user?.did;
    } else {
        // root domain for main @transgirl.love account
        did = 'did:plc:iqa6bfednevr3dztjkz5nd2m';
    }

    if (did) {
        return new Response(did, {
            status: 200, 
            headers: {
                'Content-Type': 'text/plain',
            }
        });
    }
    return new Response('Bad Request', {
        status: 400,
    });
}