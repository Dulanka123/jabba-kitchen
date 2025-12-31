from PIL import Image
import os

# Install Pillow if not exists: pip install Pillow

def create_icons():
    try:
        # ඔයාගේ logo එකේ නම (extension එක හරියට බලන්න)
        source_image = "public/logo.png"
        
        if not os.path.exists(source_image):
            print(f"❌ Error: {source_image} not found in client folder!")
            return

        img = Image.open(source_image)
        
        # public folder එකට path එක
        output_dir = "public"
        
        # 192x192
        icon192 = img.resize((192, 192))
        icon192.save(os.path.join(output_dir, "pwa-192x192.png"), "PNG")
        print("✅ public/pwa-192x192.png created!")

        # 512x512
        icon512 = img.resize((512, 512))
        icon512.save(os.path.join(output_dir, "pwa-512x512.png"), "PNG")
        print("✅ public/pwa-512x512.png created!")

    except Exception as e:
        print(f"Error: {e}")

create_icons()