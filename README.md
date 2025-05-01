# Open Panda

![Open Panda graph image](packages/fe/static/open-graph-image.jpg)

The repository for the Open Panda statically-generated frontend. Open Panda is a platform for data researchers, analysts, students, and enthusiasts to interact with the largest open datasets in the world, stored on Filecoin's decentralized network.

The `static` branch contains the statically-generated frontend and the `develop` branch contains the non-static application.

### Requirements
- This README assumes the usage of a device running macOS
- Node `v16.x` must be used. [NVM](https://github.com/nvm-sh/nvm) can be used to install and switch between multiple Node versions.

### Running the site locally

Create a `.env` file in `packages/fe` and populate with the following:

```bash
NODE_ENV=development
SERVER_ENV=development
```

Generate a localhost SSL cert:

```bash
cd ~/.ssh
brew install mkcert # replace with another package manager for linux distro
brew install nss # need to install certutil before running `mkcert -install` so the CA can be automatically installed in Firefox

# at this point, open any https website in Firefox before running the below commands

mkcert -install
mkcert -key-file localhost_key.pem -cert-file localhost_cert.pem localhost 127.0.0.1
cat localhost_cert.pem > localhost_fullchain.pem
cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost_fullchain.pem
```

Copy the generated PEM files (`localhost_cert.pem` and `localhost_key.pem`) to the root open-panda project directory.

Start the server:

```bash
npm run dev -w fe
```

Open the URL in a browser:

```txt
https://localhost:13010/
```

### Editing general site content

**Images**
Before images can be used in the site, they need to be added to the `packages/fe/static` directory. Once added, they can be referenced inside content files. For example, if you added the following image: `packages/fe/static/new-folder/fancy-image.jpeg`, then inside content files you can reference the file by using the following path: `/new-folder/fancy-image.jpeg`.

**Pages**
Page text and images can be modified by editing the corresponding page JSON file in `packages/fe/content/pages`.

**Privacy and Terms**
Unlike the rest of the site, the privacy policy and terms pages are handled through markdown and can be edited in `packages/fe/content/markdown`.

**Categories**
The home page contains a categories slider. This can be edited in `packages/fe/content/categories.json`.

### Adding a dataset

**`packages/fe/content/data/dataset-list.json`**
This file contains the dataset metadata. If a dataset is added or removed from this file, then it will be added or removed from the frontend. This is a JSON file that is an array of objects, with each object representing a dataset. Datasets will be displayed on the home page in _the same order_ as they are inputted into this array. 

The schema of all available keys for creating a dataset:

```js
{
  slug: String,
  name: String,
  replication: Number,
  size: Number,
  total: Number,
  storage: Number,
  fileExtensions: [String],
  locations: [{
    full: String,
    country_code: String
  }],
  authors: [String],
  funders: [String],
  categories: [String],
  createdAt: String,
  description: String,
  availableUntil: String,
  downloadLinks: [{
    label: String,
    url: String
  }]
}
```

Here is an example dataset with all keys populated:

```json
{
  "slug": "arpa-e-perform",
  "name": "ARPA-E Performance Data",
  "replication": 5.12,
  "size": 143254216451,
  "total": 124685412,
  "storage": 86,
  "fileExtensions": ["xml"],
  "locations": [
    {
      "full": "Japan",
      "country_code": "JP"
    }, {
      "full": "Canada",
      "country_code": "CA"
    }, {
      "full": "United States",
      "country_code": "US"
    }, {
      "full": "United Kingdom",
      "country_code": "GB"
    }
  ],
  "authors": [
    "John Doe",
    "Jane Doe"
  ],
  "funders": [
    "John Doe",
    "Jane Doe"
  ],
  "categories": [
    "Genetics",
    "Biology",
    "Genome"
  ],
  "createdAt": "May 10, 2024",
  "description": "<h5>Genome in a Bottle is an academic consortium hosted by NIST to develop reference materials and standards for clinical sequencing.</h5><p>The Genome in a Bottle Consortium is a public-private-academic consortium hosted by NIST to develop the technical infrastructure (reference standards, reference methods, and reference data) to enable translation of whole human genome sequencing to clinical practice and innovations in technologies.</p><p>The priority of GIAB is authoritative characterization of human genomes for use in benchmarking, including analytical validation and technology development, optimization, and demonstration. Current work in the GIAB Analysis Team is focused on establishing assembly-based benchmarks for challenging medically relevant genes and other difficult regions. GIAB is also exploring expanding to additional samples consented for release of WGS and redistribution of commercial products: increasing the diversity of germline reference samples and developing paired tumor-normal cell lines.</p>",
  "availableUntil": "Nov 24, 2027",
  "downloadLinks": [
    {
      "label": "Entire dataset",
      "url": "https://www.genomeinabottle.org"
    }, {
      "label": "North America",
      "url": "https://www.genomeinabottle.org"
    }, {
      "label": "Europe",
      "url": "https://www.genomeinabottle.org"
    }, {
      "label": "Asia",
      "url": "https://www.genomeinabottle.org"
    }
  ]
}
```

### Adding dataset CIDs

Dataset CIDs, as seen on the singular pages, are added separately and are not required. If not included, the CID table will be hidden. 

Dataset CIDs can be added to `packages/fe/content/datasets/**`. Each dataset must be in a separate JSON file and the file must have the following structure:

```json
{
  "pieces": [
    {
      "PieceCID": "baga6ea4seaqhprnghduw2bqjnszoqr5jy2hhke6lez6lsacviw7axa2f2pvl4dq",
      "PieceSize": "34359738368",
      "RootCID": "bafkreibruulyjd3x4xtfqjbhb5f5wohmlyb5quo237zhmjyww5w3jyqquq",
      "FileSize": "33758601502",
      "StoragePath": "baga6ea4seaqhprnghduw2bqjnszoqr5jy2hhke6lez6lsacviw7axa2f2pvl4dq.car"
    },
    {
      "PieceCID": "baga6ea4seaqfash33myagq7mgn6uruby4e2bfszyflov5jd6ru6sxn6xhqsaqba",
      "PieceSize": "34359738368",
      "RootCID": "bafkreiflviphjemjff3kexkkgppenfhybmzfsn7n37nzqrekgpcalsxea4",
      "FileSize": "33702690691",
      "StoragePath": "baga6ea4seaqfash33myagq7mgn6uruby4e2bfszyflov5jd6ru6sxn6xhqsaqba.car"
    },
    ...
  ]
}
```

All other keys in the file are ignored.

❗️ the filename **must match the slug** in the corresponding `packages/fe/content/data/dataset-list.json` dataset entry. For example, if you added a new dataset to `dataset-list.json` like so:

```json
{
  "slug": "arpa-e-perform",
  "name": "ARPA-E Performance Data",
  "replication": 5.12,
  "size": 143254216451,
  ...
}
```

Then you must add a file called `arpa-e-perform.json` (same as `slug` property) to `packages/fe/content/datasets`.

In order to generate the correct structure automatically, take the file that is produced by singularity:

```bash
AttachmentID  SourceStorageID  
1             2                
    SourceStorage
        ID  Name        Type  Path            
        2   cesmlenns2  s3    ncar-cesm-lens  
    Pieces
        PieceCID                                                          PieceSize    RootCID                                                      FileSize     StoragePath                                                           
        baga6ea4seaqhkxpnckwlp7hpiqviinlgphkslp3q6224m6kqyl44ri4wb34e6oa  34359738368  bafkreibvpthpy6hoebk7tibilqg7k3zr7rfo7j4k4msedface4pnv3grim  33803063476  baga6ea4seaqhkxpnckwlp7hpiqviinlgphkslp3q6224m6kqyl44ri4wb34e6oa.car  
        baga6ea4seaqh5ltpeufrejrha7pcdxz5nomuh4dbjcqwhbj35qqkkagev6wmqja  34359738368  bafkreibdfsyjiomahfceoydmggnrrjkdaoemzzggffkfb6cepkfvbayaau  33801808545  baga6ea4seaqh5ltpeufrejrha7pcdxz5nomuh4dbjcqwhbj35qqkkagev6wmqja.car  
        baga6ea4seaqpu27bvbkjj2ok5pwe6gatxbi72lilamdn7p2d2krrctjlkh72eai  34359738368  bafkreiekkhcz22a6lzh7oum3nmzvrhfa4dvhq67dl4kv3pui2c3qy7tmky  33770978605  baga6ea4seaqpu27bvbkjj2ok5pwe6gatxbi72lilamdn7p2d2krrctjlkh72eai.car  
        baga6ea4seaqolkvfezbcgt53hm3evxhsopdue6pbxykwrgjk3bd3e7v55dyqmmi  34359738368  bafkreihy3qqh2g74hojd5cjieq2uwzvpq7je4z65kc6qrrhpfaglgtmxpy  33807189849  baga6ea4seaqolkvfezbcgt53hm3evxhsopdue6pbxykwrgjk3bd3e7v55dyqmmi.car
```

and run this awk script:

```bash
for f in *; do
 [[ -f $f ]] && awk '
  NR==2 { a=$1; s=$2 }
  NR==5 { id=$1; n=$2; t=$3; p=$4 }
  NR>8 && NF>0 {
      x = x "{\"PieceCID\":\"" $1 "\",\"PieceSize\":\"" $2 "\",\"RootCID\":\"" $3 "\",\"FileSize\":\"" $4 "\",\"StoragePath\":\"" $5 "\"},"
  }
  END {
      sub(/,$/, "", x)
      print "{"
      print "  \"AttachmentID\": " a ","
      print "  \"SourceStorageID\": " s ","
      print "  \"SourceStorage\": {"
      print "    \"ID\": " id ","
      print "    \"Name\": \"" n "\","
      print "    \"Type\": \"" t "\","
      print "    \"Path\": \"" p "\""
      print "  },"
      print "  \"pieces\": [" x "]"
      print "}"
  }' "$f" | jq . > "$f.json"
done
```

### Generating the site

Simply run the following in order to generate the static site files:

```bash
npm run generate -w fe
```

The newly created `dist` directory in `packages/fe/dist` contains the entire site and can be deployed anywhere

For services such as Vercel or Fleek, you should set the "output" directory as `packages/fe/dist`.
