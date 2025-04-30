import re
import json

def extract_json_from_text(text):
    # Find the JSON part between ```json and ```
    pattern = r'```json\s*([\s\S]*?)\s*```'
    match = re.search(pattern, text)
    # match = re.(r'\s+', "\n")  # Remove extra spaces and newlines
    print(match)  # Debugging - show what was matched
    
    if match:
        # Get the JSON string
        json_str = match.group(1)
        
        # Print the raw extracted string for debugging
        print("Extracted JSON string:")
        print(json_str)
        print("Length:", len(json_str))
        clean_text = json_str.replace("\\n", " ")
        clean_text = clean_text.replace("Ã˜", "Ø")
        json_str = clean_text.replace("\\", "")
    
        print(json_str)
        # Check if the string starts with an opening brace
        if not json_str.strip().startswith('{'):
            print("Warning: JSON string doesn't start with '{'")
        
        try:
            # Parse the JSON string into a Python dictionary
            parsed_json = json.loads(json_str)
            return parsed_json
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            
            # Try to clean the string and parse again
            cleaned_json = json_str.strip("\n").strip(" ")
            print("\nTrying with cleaned JSON:")
            print(cleaned_json[:100] + "...")  # Print start of cleaned JSON
            
            try:
                parsed_json = json.loads(cleaned_json)
                return parsed_json
            except json.JSONDecodeError as e2:
                print(f"Error parsing cleaned JSON: {e2}")
                return None
    else:
        print("No JSON found in the text")
        return None




