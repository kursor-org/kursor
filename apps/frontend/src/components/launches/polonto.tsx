import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TopTitle } from '@kursor/frontend/components/launches/helpers/top.title.component';
import { createStore } from 'polotno/model/store';
import Workspace from 'polotno/canvas/workspace';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import Toolbar from 'polotno/toolbar/toolbar';
import ZoomButtons from 'polotno/toolbar/zoom-buttons';
import { Button } from '@kursor/react/form/button';
import { useFetch } from '@kursor/helpers/utils/custom.fetch';
import { PictureGeneratorSection } from '@kursor/frontend/components/launches/polonto/polonto.picture.generation';
import { useUser } from '@kursor/frontend/components/layout/user.context';

const store = createStore({
  key: 'Aqml_02mqf6YTKC0jYZ8',
  showCredit: false,
});

// @ts-ignore
const CloseContext = createContext({ close: {} as any, setMedia: {} as any });

const ActionControls = ({ store }: any) => {
  const close = useContext(CloseContext);
  const [load, setLoad] = useState(false);
  const fetch = useFetch();
  return (
    <div>
      <Button
        loading={load}
        className="outline-none"
        innerClassName="invert outline-none"
        onClick={async () => {
          setLoad(true);
          const blob = await store.toBlob();
          const formData = new FormData();
          formData.append('file', blob, 'media.png');
          const data = await (
            await fetch('/media/upload-simple', {
              method: 'POST',
              body: formData,
            })
          ).json();
          close.setMedia({ id: data.id, path: data.path });
          close.close();
        }}
      >
        Use this media
      </Button>
    </div>
  );
};

const Polonto: FC<{
  setMedia: (params: { id: string; path: string }) => void;
  type?: 'image' | 'video';
  closeModal: () => void;
  width?: number;
  height?: number;
}> = (props) => {
  const { setMedia, type, closeModal } = props;
  const user = useUser();

  console.log(user);
  const features = useMemo(() => {
    return [
      ...DEFAULT_SECTIONS,
      ...(user?.tier?.image_generator ? [PictureGeneratorSection] : []),
    ] as any[];
  }, [user?.tier?.image_generator]);

  useEffect(() => {
    store.addPage({
      width: props.width || 540,
      height: props.height || 675,
    });

    return () => {
      store.clear();
    };
  }, []);
  return (
    <div className="fixed left-0 top-0 bg-black/80 z-[300] w-full min-h-full p-[60px] animate-fade">
      <div className="w-full h-full bg-[#0B101B] border-tableBorder border-2 rounded-xl pb-[20px] px-[20px] relative">
        <div className="flex">
          <div className="flex-1">
            <TopTitle title="Design Media" />
          </div>
          <button
            onClick={closeModal}
            className="outline-none absolute right-[20px] top-[20px] mantine-UnstyledButton-root mantine-ActionIcon-root bg-black hover:bg-tableBorder cursor-pointer mantine-Modal-close mantine-1dcetaa"
            type="button"
          >
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="bg-white text-black relative z-[400] polonto">
          <CloseContext.Provider
            value={{ close: () => closeModal(), setMedia }}
          >
            <PolotnoContainer style={{ width: '100%', height: '1000px' }}>
              <SidePanelWrap>
                <SidePanel store={store} sections={features} />
              </SidePanelWrap>
              <WorkspaceWrap>
                <Toolbar
                  store={store}
                  components={{
                    ActionControls,
                  }}
                />
                <Workspace store={store} />
                <ZoomButtons store={store} />
              </WorkspaceWrap>
            </PolotnoContainer>
          </CloseContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default Polonto;
