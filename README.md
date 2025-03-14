# Next.js Chat Application

A modern chat application built with Next.js, React, and the AI SDK.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```bash
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Real-time chat interface with OpenAI's GPT models
- Streaming responses for a better user experience
- Modern UI with responsive design
- Error handling and user feedback
- Stop generation functionality

## Troubleshooting

If you encounter issues with the chat not responding:

1. Make sure your OpenAI API key is correctly set in the `.env.local` file
2. Check the browser console for any error messages
3. Ensure you have an active internet connection
4. Verify that your OpenAI API key has sufficient credits

## Technologies Used

- Next.js
- React
- AI SDK (@ai-sdk/react, @ai-sdk/openai)
- Tailwind CSS
- Lucide React (for icons)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
