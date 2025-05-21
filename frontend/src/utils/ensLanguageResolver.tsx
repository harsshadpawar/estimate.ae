import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/redux/features/languageSlice';

interface ENSLanguageResolverProps {
  ensName: string;
}

const ENSLanguageResolver: React.FC<ENSLanguageResolverProps> = ({ ensName }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');

    const languageMap: Record<string, string> = {
      '0x1234567890abcdef1234567890abcdef12345678': 'fr',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': 'ta',
    };

    const resolveENS = async () => {
      try {
        const address = await provider.resolveName(ensName);
        if (address) {
          const lang = languageMap[address.toLowerCase()] || 'en';
          dispatch(setLanguage(lang));
        }
      } catch (error) {
        console.error('ENS resolution failed:', error);
      }
    };

    resolveENS();
  }, [ensName, dispatch]);

  return null; // No UI, just a side effect
};

export default ENSLanguageResolver;
