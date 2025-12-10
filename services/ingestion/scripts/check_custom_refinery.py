from chonkie import Pipeline

class CustomRefinery:
    def refine(self, chunks):
        print("Custom refinery running!")
        for chunk in chunks:
            chunk.text += " [refined]"
        return chunks

def custom_func(chunks):
    print("Custom func running!")
    return chunks

try:
    pipe = Pipeline()
    # Check if we can add a custom object or function
    # The API might be .add_step() or strict .refine_with()
    # Let's try to inspect available methods
    print(f"Pipeline methods: {[m for m in dir(pipe) if not m.startswith('_')]}")
    
    # Try using a generic 'step' if it exists, or pass object to refine_with?
    # pipeline.refine_with(CustomRefinery()) 
    
    # Simpler check: see if we can register?
    pass

except Exception as e:
    print(f"Error: {e}")
