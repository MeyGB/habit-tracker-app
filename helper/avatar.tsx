export const getAvatarText = (name:string) => {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const secondInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    
    return firstInitial + secondInitial;
  }
