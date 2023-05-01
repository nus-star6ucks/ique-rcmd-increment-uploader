import { Button, Dot, Fieldset, Input, Loading, Text } from "@geist-ui/core";
import { useRequest } from "ahooks";
import axios from "axios";
import { useState } from "react";

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
      <span className="text-sm -ml-1">Ready to Run</span>
    </Dot>
  );
}

export default function Main() {
  const [usersJsonFileInput, setUsersJsonFileInput] = useState<File>();
  const [reviewJsonFileInput, setReviewJsonFileInput] = useState<File>();
  const [businessJsonFileInput, setBusinessJsonFileInput] = useState<File>();

  const { loading, run: handleUpload } = useRequest(
    (file: File) => upload(file),
    {
      manual: true,
      onSuccess(e) {
        console.log(e);
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
                completed.
              </Fieldset.Subtitle>
              <div className="space-y-4">
                <Input
                  htmlType="file"
                  label="users.json"
                  width="100%"
                  multiple={false}
                  onChange={(e) =>
                    void setUsersJsonFileInput(e.target.files?.[0])
                  }
                  accept="application/json"
                  placeholder="users.json"
                  required
                />
                <Input
                  label="review.json"
                  width="100%"
                  htmlType="file"
                  multiple={false}
                  onChange={(e) =>
                    void setReviewJsonFileInput(e.target.files?.[0])
                  }
                  accept="application/json"
                  placeholder="users.json"
                  required
                />
                <Input
                  label="business.json"
                  width="100%"
                  multiple={false}
                  onChange={(e) =>
                    void setBusinessJsonFileInput(e.target.files?.[0])
                  }
                  htmlType="file"
                  accept="application/json"
                  placeholder="users.json"
                  required
                />
              </div>
              <Fieldset.Footer>
                <span className="space-x-2 flex items-center">
                  <span>Status:</span>
                  <WorkflowStatus />
                </span>
                <Button
                  // disabled={[
                  //   businessJsonFileInput,
                  //   reviewJsonFileInput,
                  //   usersJsonFileInput,
                  // ].includes(undefined)}
                  loading={loading}
                  onClick={() => void handleUpload(businessJsonFileInput)}
                  auto
                  scale={1 / 3}
                  font="12px"
                  type="secondary"
                >
                  Upload & Trigger
                </Button>
              </Fieldset.Footer>
            </Fieldset>
            <Fieldset label="status">
              <Fieldset.Title>HTTP is extensible</Fieldset.Title>
              <Fieldset.Subtitle>Workflow Status:</Fieldset.Subtitle>
              <Fieldset.Footer>
                <Button auto scale={1 / 3} font="12px">
                  Actions
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
    console.log("Uploaded successfully!");
  } else {
    console.error("Upload failed.");
  }
};
