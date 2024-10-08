import {FC} from "react";
import {Integrations} from "@kursor/frontend/components/launches/calendar.context";
import DevtoProvider from "@kursor/frontend/components/launches/providers/devto/devto.provider";
import XProvider from "@kursor/frontend/components/launches/providers/x/x.provider";
import LinkedinProvider from "@kursor/frontend/components/launches/providers/linkedin/linkedin.provider";
import RedditProvider from "@kursor/frontend/components/launches/providers/reddit/reddit.provider";
import MediumProvider from "@kursor/frontend/components/launches/providers/medium/medium.provider";
import HashnodeProvider from "@kursor/frontend/components/launches/providers/hashnode/hashnode.provider";
import FacebookProvider from '@kursor/frontend/components/launches/providers/facebook/facebook.provider';
import InstagramProvider from '@kursor/frontend/components/launches/providers/instagram/instagram.provider';
import YoutubeProvider from '@kursor/frontend/components/launches/providers/youtube/youtube.provider';
import TiktokProvider from '@kursor/frontend/components/launches/providers/tiktok/tiktok.provider';
import PinterestProvider from '@kursor/frontend/components/launches/providers/pinterest/pinterest.provider';
import DribbbleProvider from '@kursor/frontend/components/launches/providers/dribbble/dribbble.provider';
import ThreadsProvider from '@kursor/frontend/components/launches/providers/threads/threads.provider';

export const Providers = [
    {identifier: 'devto', component: DevtoProvider},
    {identifier: 'x', component: XProvider},
    {identifier: 'linkedin', component: LinkedinProvider},
    {identifier: 'linkedin-page', component: LinkedinProvider},
    {identifier: 'reddit', component: RedditProvider},
    {identifier: 'medium', component: MediumProvider},
    {identifier: 'hashnode', component: HashnodeProvider},
    {identifier: 'facebook', component: FacebookProvider},
    {identifier: 'instagram', component: InstagramProvider},
    {identifier: 'youtube', component: YoutubeProvider},
    {identifier: 'tiktok', component: TiktokProvider},
    {identifier: 'pinterest', component: PinterestProvider},
    {identifier: 'dribbble', component: DribbbleProvider},
    {identifier: 'threads', component: ThreadsProvider},
];


export const ShowAllProviders: FC<{integrations: Integrations[], value: Array<{content: string, id?: string}>, selectedProvider?: Integrations}> = (props) => {
    const {integrations, value, selectedProvider} = props;
    return (
        <>
            {integrations.map((integration) => {
                const {component: ProviderComponent} = Providers.find(provider => provider.identifier === integration.identifier) || {component: null};
                if (!ProviderComponent || integrations.map(p => p.id).indexOf(selectedProvider?.id!) === -1) {
                    return null;
                }
                return <ProviderComponent key={integration.id} {...integration} value={value} show={selectedProvider?.id === integration.id} />;
            })}
        </>
    )
}