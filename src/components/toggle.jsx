import React from 'react'

/**************************************************************************************************/

/**
 * @file        toggle.jsx
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang]
 * @created     21/08/2025
 * @license     -- tbd
 */

const Toggle = ({ checked, onToggle }) => {
  const toggledClass = checked ? 'bg-[#4691AE]' : 'bg-button-primary';
  const thumbClass = checked ? 'left-[calc(70px-38px)]' : 'left-[3px]';

  return (
    <button
      style={{ borderRadius: '99px' }}
      onClick={onToggle}
      className={`w-[70px] h-[40px] cursor-pointer relative ${toggledClass}`}>
      <div className={`size-[32px] bg-white rounded-full absolute top-1/2 
        translate-y-[-50%] transition-[left] duration-300 ease-in-out ${thumbClass}`}>
      </div>
    </button >
  )
}

export default Toggle