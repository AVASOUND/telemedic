import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient({});
const chain = "ethereum";

class Lit {
    public litNodeClient:any
  
    async connect() {
      await client.connect()
      this.litNodeClient = client
    }
  }

//Convert Blob to string
const blobToBase16 = (blob) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        const buffer = reader.result;
        const uintArray = new Uint8Array(buffer);
        const base16String = Array.from(uintArray)
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        resolve(base16String);
      };
    });
  };

  
  
  export const encryptNotes = async(notes:string,address1:string,address2:string)=>{
    
    const client = new Lit()

    if (!client.litNodeClient) {
        await client.connect()
      }
      const chain = "ethereum"
   
      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain,
          method: '',
          parameters: [
            ':userAddress',
          ],
          returnValueTest: {
            comparator: '=',
            value: address1
          }
        },
         {
            "operator":"or"
          },
          {
          contractAddress: '',
          standardContractType: '',
          chain,
          method: '',
          parameters: [
            ':userAddress',
          ],
          returnValueTest: {
            comparator: '=',
            value: address2
          }
        }
      ]
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        notes
      );
      const encryptedSymmetricKey = await client.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain
      });

      return {
         encryptedString:encryptedString
,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
      }
  }


  export const decryptNotes = async(notes:Blob,address1:string,address2:string,encryptedSymmetricKey:string)=>{
    
    const client = new Lit()

    if (!client.litNodeClient) {
        await client.connect()
      }
      const chain = "ethereum"
   
      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain,
          method: '',
          parameters: [
            ':userAddress',
          ],
          returnValueTest: {
            comparator: '=',
            value: address1
          }
        },
         {
            "operator":"or"
          },
          {
          contractAddress: '',
          standardContractType: '',
          chain,
          method: '',
          parameters: [
            ':userAddress',
          ],
          returnValueTest: {
            comparator: '=',
            value: address2
          }
        }
      ]
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
    const symmetricKey = await client.litNodeClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig,
      });
    const decryptedString = await LitJsSdk.decryptString(
         notes,
        symmetricKey
      );
  
    return { decryptedString }
  }