import {
  Button,
  Dot,
  Fieldset,
  Input,
  Loading,
  Text,
  useToasts,
} from "@geist-ui/core";
import { useRequest } from "ahooks";
import axios from "axios";
import { useState } from "react";
import { runNewDataIncoming } from "../lib/utils";

function WorkflowStatus() {
  const { data: statusData } = useRequest(
    () => axios.get("/api/databricks-workflow-status"),
    {
      pollingInterval: 1000,
    }
  );

  if (!statusData) {
    return <Loading />;
  }

  if (!statusData.data.isActive) {
    return (
      <Dot type="error">
        <span className="text-sm">Busy</span>
      </Dot>
    );
  }

  return (
    <Dot type="success">
      <span className="text-sm">Ready</span>
    </Dot>
  );
}

export default function Main() {
  const [datasetZipFileInput, setDatasetZipFileInput] = useState<File>();

  const { setToast } = useToasts();
  const { loading, run: handleUpload } = useRequest(
    (file: File) =>
      upload(file).then((filename) =>
        axios.post("/api/trigger-new-data-incoming-run", {
          zipFilename: filename,
        })
      ),
    {
      manual: true,
      onSuccess(e) {
        setToast({
          text: "Uploaded and triggered successfully!",
          type: "success",
        });
      },
      onError(e) {
        setToast({
          text: e.message,
          type: "error",
        });
      },
    }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="text-center py-4 shadow-lg shadow-neutral-100">
        <Text className="m-0 p-0" h4>
          iQue Recommendation Uploader
        </Text>
      </header>
      <main className="flex items-center justify-center px-4 grow">
        <div className="max-w-2xl">
          <Fieldset.Group value="upload" className="box-border">
            <Fieldset label="upload">
              <Fieldset.Title>Upload incremental datasets</Fieldset.Title>
              <Fieldset.Subtitle>
                Databricks workflow will be triggered when upload process is
                completed. A single zip includes 3 json files:{" "}
                <code>business.json</code>, <code>review.json</code>,{" "}
                <code>user.json</code>.
              </Fieldset.Subtitle>
              <div className="space-y-4">
                <Input
                  htmlType="file"
                  label="dataset.zip"
                  width="100%"
                  multiple={false}
                  onChange={(e) =>
                    void setDatasetZipFileInput(e.target.files?.[0])
                  }
                  accept="application/zip"
                  placeholder="dataset.zip"
                  required
                />
              </div>
              <Fieldset.Footer>
                <span className="space-x-2 flex items-center">
                  <span>Status:</span>
                  <WorkflowStatus />
                </span>
                <Button
                  loading={loading}
                  onClick={() => void handleUpload(datasetZipFileInput)}
                  auto
                  scale={1 / 3}
                  font="12px"
                  type="secondary"
                >
                  Upload & Trigger
                </Button>
              </Fieldset.Footer>
            </Fieldset>
          </Fieldset.Group>
        </div>
      </main>
    </div>
  );
}

const upload = async (file: File) => {
  const filename = Date.now();
  const fileType = encodeURIComponent(file.type);

  const res = await fetch(
    `/api/upload-url?file=${filename}&fileType=${fileType}`
  );
  const { url, fields } = await res.json();
  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (upload.ok) {
    return filename;
  } else {
    throw new Error("Upload failed.");
  }
};
