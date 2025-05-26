def extract_json_from_text(text):
    """
    Extract JSON from text that may contain ThinkingBlock and TextBlock structures.
    Maintains compatibility with the original function style while handling new formats.
    
    Args:
        text (str): Text containing JSON code blocks, possibly within TextBlock structures
        
    Returns:
        dict: Parsed JSON data if successful, None otherwise
    """
    import re
    import json
    
    # Try multiple patterns to find JSON
    patterns = [
        # Pattern 1: Direct code blocks (original approach)
        r'```json\s*([\s\S]*?)\s*```',
        
        # Pattern 2: Inside TextBlock
        r"TextBlock\([^)]*text='```json\s*([\s\S]*?)\s*```'",
        
        # Pattern 3: More specific TextBlock pattern
        r"TextBlock\(citations=None, text='```json\s*([\s\S]*?)\s*```'"
    ]
    
    match = None
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            break
    
    # # Print debugging info - show what was matched
    # print(f"Match found: {match is not None}")
    
    if match:
        # Get the JSON string
        json_str = match.group(1)
        
        # Print the raw extracted string for debugging
        print("Extracted JSON string:")
        # print(json_str[:100] + "..." if len(json_str) > 100 else json_str)  # Show first 100 chars
        print("Length:", len(json_str))
        
        # Clean the string
        clean_text = json_str.replace("\\n", " ")
        clean_text = clean_text.replace("Ã˜", "Ø")
        json_str = clean_text.replace("\\", "")
        
        print("Cleaned JSON:")
        # print(json_str[:100] + "..." if len(json_str) > 100 else json_str)
        
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
                
                # One more attempt: sometimes there are escape sequences issues
                try:
                    # Replace escaped characters and try again
                    really_cleaned = cleaned_json.replace("\\'", "'").replace('\\"', '"')
                    parsed_json = json.loads(really_cleaned)
                    return parsed_json
                except json.JSONDecodeError:
                    return None
    else:
        print("No JSON found in the text")
        return None


def main(textin):
    """Simple test function to verify the extraction works"""
    import json
    
    # Read the file
    try:
        text = str(textin)
        with open("output.txt", "w", encoding="utf-8") as f:
            f.write(text)
        
        with open("output.txt", "r", encoding="utf-8") as f:
            text = f.read()
            
        # Extract JSON
        result = extract_json_from_text(text)
        
        if result:
            print("\nExtraction successful!")
            print("JSON structure:")
            print(json.dumps(result, indent=2)[:200] + "...")  # Show first 200 chars of formatted JSON
            
            # Save the result
            # with open("extracted_machining_analysis.json", "w", encoding="utf-8") as outfile:
            #     json.dump(result, outfile, indent=4)
            print("JSON saved to extracted_machining_analysis.json")
            return result
        else:
            print("Extraction failed.")
    except Exception as e:
        print(f"Error: {e}")

