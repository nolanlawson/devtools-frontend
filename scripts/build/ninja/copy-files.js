// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const fs = require('fs');
const path = require('path');
const [, , src, dest, files] = process.argv;

for (const file of files.split(',')) {
  const srcPath = path.join(process.cwd(), src, file);
  const destPath = path.join(process.cwd(), dest, file);

  // If there's a file there from a previous build, unlink it first. This
  // is because the file in that location might be a hardlinked file, and
  // overwriting it doesn't change the fact that it's hardlinked.
  if (fs.existsSync(destPath)) {
    fs.unlinkSync(destPath);
  }

  // Force a write to the target filesystem, since by default the ninja
  // toolchain will create a hardlink, which in turn reflects changes in
  // gen and resources/inspector back to //front_end.
  fs.writeFileSync(destPath, fs.readFileSync(srcPath));
}
