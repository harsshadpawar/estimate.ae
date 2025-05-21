import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setLanguage } from '@/redux/features/languageSlice';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'arabic' },
  { code: 'ta', label: 'Tamil' },
];

const LanguageDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const selectedLang = useSelector((state: RootState) => state.language.currentLanguage);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value));
  };

  return (
    <select style={{backgroundColor: 'transparent',color:'#ffffff', fontWeight: 700,
      fontSize: '14px', borderRadius:'12px',padding:'0px 16px',border:'1px solid white'}} value={selectedLang} onChange={handleChange}>
      {languages.map((lang) => (
        <option style={{color:'#000000'}} key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageDropdown;
