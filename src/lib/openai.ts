import { OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY
});

export const openai = new OpenAIApi(configuration);

export const getBasePrompt = ({
	name,
	age,
	language,
	bio,
	level
}: {
	name: string;
	age: number | string;
	language: string;
	bio: string;
	level: string;
}) => `I am a foreign language teacher teaching remotely.
I have a few of my own students, but also get students from platforms like Preply, and iTalki

With most of my work with students we focus on listening and reading comprehension and speaking.
I will try to personalize the content I am using to each of my students. I want to find content that is relevant, engaging ,and  fresh.

Sometimes I reuse what I have, but sometimes I take time to search for it, or write my own content.

Given the following student background, can you give top-3 topics I can talk with them; make sure that the topics are relevant to his interests and goals:

student - ${name}, ${age} years old, learning ${language}, currently at level ${level}
He is interested in ${bio}`;
