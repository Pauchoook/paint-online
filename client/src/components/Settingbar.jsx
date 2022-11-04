import React from 'react';
import toolState from '../store/toolState';
import '../styles/settingbar.scss';

function Settingbar(props) {
   return (
      <div className='settingbar'>
         <label className='settingbar__label' htmlFor="line-width">Толщина линии</label>
         <input 
            onChange={(e) => toolState.setLineWidth(e.target.value)}
            id='line-width' 
            defaultValue={1} 
            min={1}
            type="number"
            className='settingbar__number'
            />
         <label className='settingbar__label' htmlFor="color-width">Цвет обводки</label>
         <div className="settingbar__color">
            <input 
               onChange={(e) => toolState.setStrokeColor(e.target.value)} 
               id='color-width' 
               type="color" 
               className="settingbar__color--input" />
         </div>
      </div>
   );
}

export default Settingbar;