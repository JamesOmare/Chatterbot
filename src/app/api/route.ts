import { NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";

const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});

export async function POST(req: Request, res: NextResponse) {
    const body = await req.json()
    console.log(body.messages)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages,
    });

    try {
        console.log(completion.choices[0].message);
        const response = completion.choices[0].message;
        return NextResponse.json({ output: response }, { status: 200 })
        
      }
      catch (error) {
        if (error instanceof APIError && error.status === 429) {
          console.error("Rate-limited by OpenAI:", error.message);
          NextResponse.json({ error: { message: error.message } }, { status: 429 });
        } else {
          console.error("Unexpected error:", error);
          NextResponse.json({ error: { message: "Something went wrong, please try again" } },  { status: 500 });
        }
      }
  
  };

// export async function POST(req: Request, res: NextResponse) {
//   const body = await req.json();
//   const completion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: body.messages,
//   });
//   console.log("Error is",completion.choices[0].message);
//   const theResponse = completion.choices[0].message;

//   return NextResponse.json({ output: theResponse }, { status: 200 });
// }