import re
import json
import prompt.json_extractor as json_extractor



def create_prompt(client,examples,system_prompt, user_prompt):
    # Replace placeholders like {{var_material}} with real values,
    # because the SDK does not support variables.
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=8192,
        temperature=1,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": examples
                    },
                    {
                        "type": "text",
                        "text": user_prompt
                    }
                ]
            }
        ],
        thinking={
            "type": "enabled",
            "budget_tokens": 6554
        }
    )
    print(message.content)
    return message.content




def main(client,examples, system_prompt, user_prompt):
    # Call the function to create the prompt
    output = create_prompt(client,examples,system_prompt,user_prompt)
    # Extract JSON from the output
    json_output = json_extractor.main(f"""{output}""")
    return json_output
    
#input parameters

