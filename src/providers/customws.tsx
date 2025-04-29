import { Doc, applyUpdate } from "yjs";
import { ConnectProvider } from "./types";
import { base64ToUint8Array } from "@/utils";

export class CustomWSConnectProvider implements ConnectProvider {
  private provider?: WebSocket
  constructor(url: string, doc: Doc) {
    this.doc = doc
    this.provider = new WebSocket(url)
  }
  connect(): void {
  }
  disconnect(): void {
    this.provider?.close()
  }
  
  doc: Doc

  async waitForSynced(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.provider)
        this.provider.onmessage = (event: { data: string}) => {
          console.log('opened', event)
          const uint8array = base64ToUint8Array(event.data)
          applyUpdate(this.doc, uint8array)
          resolve()
        }
    })
  }
}