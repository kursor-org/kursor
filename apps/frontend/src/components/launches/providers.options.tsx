import {FC, useEffect, useState} from "react";
import {Integrations} from "@kursor/frontend/components/launches/calendar.context";
import {PickPlatforms} from "@kursor/frontend/components/launches/helpers/pick.platform.component";
import {IntegrationContext} from "@kursor/frontend/components/launches/helpers/use.integration";
import {ShowAllProviders} from "@kursor/frontend/components/launches/providers/show.all.providers";
import dayjs from "dayjs";
import { useStateCallback } from '@kursor/react/helpers/use.state.callback';

export const ProvidersOptions: FC<{
  integrations: Integrations[];
  editorValue: Array<{ id?: string; content: string }>;
  date: dayjs.Dayjs;
}> = (props) => {
  const { integrations, editorValue, date } = props;
  const [selectedIntegrations, setSelectedIntegrations] = useStateCallback([
    integrations[0],
  ]);

  useEffect(() => {
    if (integrations.indexOf(selectedIntegrations[0]) === -1) {
      setSelectedIntegrations([integrations[0]]);
    }
  }, [integrations, selectedIntegrations]);
  return (
    <div className="flex flex-1 flex-col">
      <PickPlatforms
        integrations={integrations}
        selectedIntegrations={selectedIntegrations}
        onChange={setSelectedIntegrations}
        singleSelect={true}
        hide={integrations.length === 1}
        isMain={false}
      />
      <IntegrationContext.Provider
        value={{ value: editorValue, integration: selectedIntegrations?.[0], date }}
      >
        <ShowAllProviders
          value={editorValue}
          integrations={integrations}
          selectedProvider={selectedIntegrations?.[0]}
        />
      </IntegrationContext.Provider>
    </div>
  );
};