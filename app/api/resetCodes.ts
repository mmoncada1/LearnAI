// Shared storage for password reset codes
// In a production environment, this should be replaced with a persistent store like Redis or a database.
// For development, this in-memory Map is sufficient and avoids file system issues during hot-reloads.

export interface ResetCode {
  code: string;
  expires: number;
}

// Using a global symbol ensures the Map is not re-initialized on every hot-reload
const globalForResetCodes = global as unknown as {
  resetCodes: Map<string, ResetCode> | undefined;
};

const resetCodesMap =
  globalForResetCodes.resetCodes ?? new Map<string, ResetCode>();

if (process.env.NODE_ENV !== 'production') {
  globalForResetCodes.resetCodes = resetCodesMap;
}

export const resetCodes = {
  set(email: string, code: ResetCode) {
    console.log('💾 STORING code for email:', email, 'Expires at:', new Date(code.expires).toLocaleTimeString());
    resetCodesMap.set(email, code);
    console.log('📊 Total codes stored:', resetCodesMap.size);
  },
  
  get(email: string): ResetCode | undefined {
    console.log('🔍 LOOKING for code for email:', email);
    const code = resetCodesMap.get(email);
    
    if (code) {
      // Check if expired
      if (Date.now() > code.expires) {
        console.log('⏰ Code EXPIRED for email:', email);
        this.delete(email);
        return undefined;
      }
      console.log('✅ FOUND VALID code for email:', email);
      return code;
    }
    
    console.log('❌ NO CODE FOUND for email:', email);
    return undefined;
  },
  
  delete(email: string) {
    console.log('🗑️ DELETING code for email:', email);
    resetCodesMap.delete(email);
  },
  
  // Debug method - without exposing actual codes
  debug() {
    console.log('🐛 DEBUG - Current state of in-memory reset codes:');
    console.log(`📊 Total codes: ${resetCodesMap.size}`);
    if (resetCodesMap.size > 0) {
      console.log('🗂️ Emails with active codes:');
      resetCodesMap.forEach((value, key) => {
        console.log(`  📧 ${key} (expires: ${new Date(value.expires).toLocaleTimeString()})`);
      });
    } else {
      console.log('🗂️ No codes currently stored.');
    }
  }
};
