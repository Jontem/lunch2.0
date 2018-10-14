import fetch from "node-fetch";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { getData } from "./get-data";
import { parse, Restaurant } from "./parser";
import { RouteResult } from "./route-result";

interface Action {
  readonly type: "button";
  readonly text: string;
  readonly url: string;
}
interface SlackDataResponse {
  response_type: "in_channel";
  text: string;
  attachments: ReadonlyArray<{
    title: string;
    text: string;
    fallback: string;
    actions: ReadonlyArray<Action>;
    mrkdwn_in: ReadonlyArray<string>;
  }>;
}

interface ImmediateResponse {
  response_type: "ephemeral";
  text: string;
}

interface SlackPostBody {
  // token=gIkuvaNzQIHg97ATvDxqgjtO
  readonly token: string;
  // team_id=T0001
  readonly team_id: string;
  // team_domain=example
  readonly team_domain: string;
  // enterprise_id=E0001
  readonly enterprise_id: string;
  // enterprise_name=Globular%20Construct%20Inc
  readonly enterprise_name: string;
  // channel_id=C2147483705
  readonly channel_id: string;
  // channel_name=test
  readonly channel_name: string;
  // user_id=U2147483697
  readonly user_id: string;
  // user_name=Steve
  readonly user_name: string;
  // command=/weather
  readonly command: string;
  // text=94070
  readonly text: string;
  // response_url=https://hooks.slack.com/commands/1234/5678
  readonly response_url: string;
  // trigger_id=13345224609.738474920.8088930838d88f008e0
  readonly trigger_id: string;
}

export async function slack(
  cachePath: string,
  body: SlackPostBody
): Promise<RouteResult> {
  setImmediate(
    async (): Promise<void> => {
      const userRequest = parseUserText(body.text);
      const userId = body.user_id;
      const res = await getData(cachePath);
      switch (res.type) {
        case "Success": {
          const parsed = parse(res.data)
            .filter(r => r.menu)
            .slice(0, userRequest.count);
          setImmediate(() => {
            sendSlackDataResponse(body.response_url, userId, parsed);
          }, 0);
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

const menuReplacer = /(&lt;br \/>|<\s? b\/>)/g;

async function sendSlackDataResponse(
  responseUrl: string,
  userId: string,
  restaurants: ReadonlyArray<Restaurant>
): Promise<void> {
  const response: SlackDataResponse = {
    response_type: "in_channel",
    text: `<@${userId}> is hungry!. Here's today's menus`,
    attachments: restaurants.map(r => ({
      title: `${r.name} - ${r.distance}m`,
      text: `${r.menu && r.menu.replace(menuReplacer, "\n")}${r.menu &&
        r.weeksAlternative &&
        "\n\n"}${printWeeksAlternative(r.weeksAlternative)}`,
      fallback: `Website: ${r.website}`,
      actions: r.website ? [createWebsiteActionButton(r.website)] : [],
      mrkdwn_in: ["text"]
    }))
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

function createWebsiteActionButton(url: string): Action {
  return {
    type: "button",
    text: "Website",
    url: createWebsiteUrl(url)
  };
}

function printWeeksAlternative(alternatives: string | undefined): string {
  if (!alternatives) {
    return "";
  }

  return `*Alternatives:*\n\n ${alternatives.replace(menuReplacer, "\n")}`;
}

const httpRegex = /https?:\/\//i;
function createWebsiteUrl(url: string): string {
  if (httpRegex.test(url)) {
    return url;
  }
  return `http://${url}`;
}
