# NJSIG Organization Website

This repository contains the source code for the NJSIG (New Jersey Schools Insurance Group) website. The website provides information about NJSIG's services, resources, and contact details. The group is dedicated to providing insurance solutions for educational institutions in New Jersey.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)
- [Third-Party Software Notices](#third-party-software-notices)

## Requirements

#### Infrastructure

- MongoDB
- Image Transformation Service
- S3 Object Storage
- SMTP Service

#### Development Environment

- Node.js v24 or higher
- pnpm v10 or higher
- Recommended: Turbopack for enhanced development performance

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NJSIG/org-website.git
   ```
2. Navigate to the project directory:
   ```bash
   cd org-website
   ```
3. Install the dependencies:
   ```bash
   pnpm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add any necessary environment variables as specified in the documentation or `.env.example` file.
5. Start the development server:

   ```bash
    pnpm dev

    # You can also run with Turbopack:
    pnpm dev --turbo
   ```

## Contributing

TODO

## License

Copyright © 2026 New Jersey Schools Insurance Group.

This project is licensed under the Elastic License 2.0.
You may not use this software to provide a commercial hosted or managed service.
See the [LICENSE](LICENSE) file for details.

## Third-Party Software Notices

See our [Third-Party Software Notices](NOTICE.md) file for details on third-party software used in this project.
