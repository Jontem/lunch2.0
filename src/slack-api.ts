import fetch from "node-fetch";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { getData } from "./get-data";
import { parse } from "./parser";
import { RouteResult } from "./route-result";

interface SlackDataResponse {
  response_type: "in_channel";
  text: string;
  attachments: ReadonlyArray<{
    text: string;
  }>;
}

interface ImmediateResponse {
  response_type: "ephemeral";
  text: string;
}

interface SlackPostBody {
  // token=gIkuvaNzQIHg97ATvDxqgjtO
  readonly token: string;
  // &team_id=T0001
  readonly "&team_id": string;
  // &team_domain=example
  readonly "&team_domain": string;
  // &enterprise_id=E0001
  readonly "&enterprise_id": string;
  // &enterprise_name=Globular%20Construct%20Inc
  readonly "&enterprise_name": string;
  // &channel_id=C2147483705
  readonly "&channel_id": string;
  // &channel_name=test
  readonly "&channel_name": string;
  // &user_id=U2147483697
  readonly "&user_id": string;
  // &user_name=Steve
  readonly "&user_name": string;
  // &command=/weather
  readonly "&command": string;
  // &text=94070
  readonly "&text": string;
  // &response_url=https://hooks.slack.com/commands/1234/5678
  readonly "&response_url": string;
  // &trigger_id=13345224609.738474920.8088930838d88f008e0
  readonly "&trigger_id": string;
}

export async function slack(
  cachePath: string,
  body: SlackPostBody
): Promise<RouteResult> {
  setImmediate(
    async (): Promise<void> => {
      const userRequest = parseUserText(body["&text"]);
      const res = await getData(cachePath);
      switch (res.type) {
        case "Success": {
          const parsed = parse(res.data).filter(r => r.menu);
          sendSlackDataResponse(body["&response_url"]);
          return;
        }
        case "Failure": {
          return;
        }
        default: {
          exhaustiveCheck(res);
          return;
        }
      }
    }
  );

  return {
    statusCode: 200,
    body: createImmediateResponse("Command received. Working on it...")
  };
}

function createImmediateResponse(text: string): ImmediateResponse {
  return {
    response_type: "ephemeral",
    text
  };
}

async function sendSlackDataResponse(responseUrl: string): Promise<void> {
  const response: SlackDataResponse = {
    response_type: "in_channel",
    text: "it works",
    attachments: []
  };
  try {
    await fetch(responseUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(response)
    });
  } catch (e) {
    console.error(e);
  }
}

const userRegex = /(n\s)?(\d+)/;

function parseUserText(text: string): { readonly count: number } {
  const matches = text.match(userRegex);
  const count = matches && matches[2] ? parseInt(matches[2], 10) : 20;
  return {
    count
  };
}
