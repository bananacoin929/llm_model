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
    .catch((err) => console.error("Error: prompt/settings", err));
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
    .catch((err) => console.error("Error: prompt/byname/", err));
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
    .catch((err) => console.error("Error: prompt/query", err));
};

export const updatePreviewPrompt = async (curRequestInfo: any) => {
  // console.log(curRequestInfo)
  return await axios
    .put(process.env.NEXT_PUBLIC_LLM_API + "api/LLMRequest", curRequestInfo)
    .then((response) => response.data)
    .catch((err) => {
      console.error("Error: api/LLMRequest", err);
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
    .then((response) => response.data)
    .catch((err) => console.error("Error: prompt/request", err));
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
    .catch((err) => console.error("Error: api/object/object", err));
};
