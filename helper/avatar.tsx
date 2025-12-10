export const getAvatarText = (name:string) => {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    const first = nameParts[0].charAt(0).toUpperCase();
    const last = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    
    return first + last;
  }
