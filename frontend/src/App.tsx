import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import PromptSubmit from './components/PromptSubmit/PromptSubmit';
import Message from './components/Message/Message';
import Loader from './components/Common/Loader';

interface PromptData {
  prompt: string | null;
  bot: any;
}

function App() {
  const [list, setList] = useState<PromptData[]>([])
  const [isloading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    console.log(isloading, 'list')
  }, [isloading])
  return (
    <div className='flex h-[80vh] justify-center flex-col items-center'>
      {/* <h1 className='pb-7 font-semibold'>ChatBot (ReactJS + Django + OpenAi)</h1> */}
      <div className='border-black relative border-2 h-[667px] border- w-[375px] bg-[#ECECEC] mx-auto rounded-md'>
        <Header />
        <ul className='py-3 px-2 h-[587px] overflow-y-auto'>
          {list.map(item => {
            return (
              <>
                <Message key={`${Math.random()}-${Date.now()}`} item={item} />
              </>
            )
          })}
          <li>
           {isloading && <div className='flex justify-center items-center'><Loader /></div>}
          </li>
          
        </ul>
        <PromptSubmit isloading={isloading} setIsLoading={setIsLoading} setList={setList} list={list} />
      </div>
    </div>
  );
}

export default App;
