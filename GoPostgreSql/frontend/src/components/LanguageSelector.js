import React from 'react';
import { Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleChangeLanguage = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <Select
            placeholder="Select Language"
            onChange={handleChangeLanguage}
            width="150px" // Set width as needed
            bg="gray.700"
            color="white"
             >
            <option value="en">English</option>
            <option value="it">Italian</option>
            <option value="es">Spanish</option>
           <option value="zh">Chinese</option>
         </Select>
    );
};

export default LanguageSelector;