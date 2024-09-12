"use server";

import axios from "axios";

export const getHomeData = async () => {
  return await fetch(process.env.NEXT_PUBLIC_LLM_API + "prompt/settings", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
};

export const getLLmRequestInfo = async (LLMRequestName: any) => {
  return await fetch(
    process.env.NEXT_PUBLIC_LLM_API + `prompt/byname/${LLMRequestName}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
};

export const updateJson = async (
  inputJson: Object,
  Tags: Object,
  LLMRequestName: string
) => {
  let formData = new FormData();

  formData.append("inputJson", JSON.stringify(inputJson));
  formData.append("Tags", JSON.stringify(Tags));
  formData.append("LLMRequestName", LLMRequestName);

  return await axios
    .post(process.env.NEXT_PUBLIC_LLM_API + "prompt/query", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch((err) => console.error("Error"));
};

export const updatePreviewPrompt = async (curRequestInfo: any) => {
  return await axios
    .put(process.env.NEXT_PUBLIC_LLM_API + "api/LLMRequest", curRequestInfo)
    .then((response) => response.data)
    .catch((err) => {
      console.log(err);
    });
};


export const runPromptRequest = async (
  inputJson: Object,
  Tags: Object,
  LLMRequestName: string
) => {
  let formData = new FormData();

  formData.append("inputJson", JSON.stringify(inputJson));
  formData.append("Tags", JSON.stringify(Tags));
  formData.append("LLMRequestName", LLMRequestName);

  return await axios
    .post(process.env.NEXT_PUBLIC_LLM_API + "prompt/request", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {console.log(response); return response.data})
    .catch((err) => console.error("Error"));
};

export const getInputJson = async (Object: any, ObjectId: any) => {
  return await fetch(
    process.env.NEXT_PUBLIC_LLM_API + `api/${Object}/${ObjectId}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
};
